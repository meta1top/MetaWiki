import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AppError, Transactional, WithLock } from "@meta-1/nest-common";
import type { WikiRepo, WikiRepoDetail } from "@meta-1/wiki-types";
import { WikiRepoDetailSchema, WikiRepoSchema } from "@meta-1/wiki-types";
import { CreateWikiRepoDto } from "../dto";
import { WikiRepo as WikiRepoEntity } from "../entity";
import { ErrorCode } from "../shared";

@Injectable()
export class WikiRepoService {
  constructor(@InjectRepository(WikiRepoEntity) private repository: Repository<WikiRepoEntity>) {}

  @WithLock({
    key: "wiki-repo:create:#{path}",
    ttl: 10000, // 10 秒
    waitTimeout: 2000, // 等待 2 秒
    errorMessage: "知识库创建中，请稍后重试",
  })
  @Transactional()
  async create(dto: CreateWikiRepoDto, creatorId: string): Promise<void> {
    // 检查访问路径是否已存在
    const existingRepo = await this.repository.findOne({
      where: { path: dto.path },
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
      where: { creatorId },
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
      where: { path },
      select: ["cover", "name", "path", "description"],
    });

    if (!repo) {
      throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
    }

    return WikiRepoDetailSchema.parse(repo);
  }
}
