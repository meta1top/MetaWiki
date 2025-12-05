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
    key: "wiki-repo:create",
    ttl: 10000,
    waitTimeout: 2000,
    errorMessage: "知识库创建中，请稍后重试",
  })
  @Transactional()
  async create(dto: CreateWikiRepoDto, creatorId: string): Promise<void> {
    // 创建知识库（不再需要 path 唯一性检查，使用 id 作为唯一标识）
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

  async getById(id: string): Promise<WikiRepoDetail> {
    const repo = await this.repository.findOne({
      where: { id, deleted: false },
      select: ["id", "cover", "name", "description", "embeddingModelId", "rerankModelId"],
    });

    if (!repo) {
      throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
    }

    return WikiRepoDetailSchema.parse(repo);
  }

  async getByPath(path: string): Promise<WikiRepoDetail> {
    // 向后兼容：按 id 查询（path 参数实际是 id）
    const repo = await this.repository.findOne({
      where: { id: path, deleted: false },
      select: ["id", "cover", "name", "description", "embeddingModelId", "rerankModelId"],
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

    // 过滤掉 null 值，因为模型字段现在是必填的
    const updateData: Partial<WikiRepoEntity> = {
      updaterId: userId,
      updateTime: new Date(),
    };

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }
    if (dto.cover !== undefined) {
      updateData.cover = dto.cover;
    }
    if (dto.embeddingModelId !== undefined && dto.embeddingModelId !== null) {
      updateData.embeddingModelId = dto.embeddingModelId;
    }
    if (dto.rerankModelId !== undefined && dto.rerankModelId !== null) {
      updateData.rerankModelId = dto.rerankModelId;
    }

    await this.repository.update(id, updateData);
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
