import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AppError, Transactional, WithLock } from "@meta-1/nest-common";
import type { WikiRepo, WikiRepoDetail } from "@meta-1/wiki-types";
import { WikiRepoDetailSchema, WikiRepoSchema } from "@meta-1/wiki-types";
import { CreateWikiRepoDto, UpdateWikiRepoDto } from "../dto";
import { WikiRepo as WikiRepoEntity } from "../entity";
import { ErrorCode } from "../shared";

@Injectable()
export class WikiRepoService {
  constructor(@InjectRepository(WikiRepoEntity) private repository: Repository<WikiRepoEntity>) {}

  @WithLock({
    key: "wiki-repo:create:#{path}",
    ttl: 10000,
    waitTimeout: 2000,
    errorMessage: "知识库创建中，请稍后重试",
  })
  @Transactional()
  async create(dto: CreateWikiRepoDto, creatorId: string): Promise<void> {
    // 检查访问路径是否已存在
    const existingRepo = await this.repository.findOne({
      where: { path: dto.path, deleted: false },
    });

    if (existingRepo) {
      throw new AppError(ErrorCode.WIKI_REPO_PATH_EXISTS);
    }

    // 创建知识库
    const repo = this.repository.create({
      ...dto,
      creatorId,
      createTime: new Date(),
    });

    await this.repository.save(repo);
  }

  async list(creatorId: string): Promise<WikiRepo[]> {
    const repos = await this.repository.find({
      where: { creatorId, deleted: false },
      order: { updateTime: "DESC", createTime: "DESC" },
    });

    return repos.map((repo) =>
      WikiRepoSchema.parse({
        ...repo,
        createTime: repo.createTime.toISOString(),
        updateTime: repo.updateTime?.toISOString() ?? null,
      }),
    );
  }

  async getByPath(path: string): Promise<WikiRepoDetail> {
    const repo = await this.repository.findOne({
      where: { path, deleted: false },
      select: ["cover", "name", "path", "description"],
    });

    if (!repo) {
      throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
    }

    return WikiRepoDetailSchema.parse(repo);
  }

  @Transactional()
  async update(id: string, dto: UpdateWikiRepoDto, userId: string): Promise<void> {
    const repo = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!repo) {
      throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
    }

    if (repo.creatorId !== userId) {
      throw new AppError(ErrorCode.REPOSITORY_ACCESS_DENIED);
    }

    // path 字段不允许修改，只更新 name、description、cover
    await this.repository.update(id, {
      ...dto,
      updaterId: userId,
      updateTime: new Date(),
    });
  }

  @Transactional()
  async delete(id: string, userId: string): Promise<void> {
    const repo = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!repo) {
      throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
    }

    if (repo.creatorId !== userId) {
      throw new AppError(ErrorCode.REPOSITORY_ACCESS_DENIED);
    }

    await this.repository.update({ id }, { deleted: true });
  }
}
