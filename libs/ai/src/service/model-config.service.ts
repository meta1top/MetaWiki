import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";

import { AppError, Transactional } from "@meta-1/nest-common";
import type { ModelConfig } from "@meta-1/wiki-types";
import { ModelConfigSchema } from "@meta-1/wiki-types";
import { CreateModelConfigDto, UpdateModelConfigDto } from "../dto";
import { ModelConfig as ModelConfigEntity } from "../entity";
import { ErrorCode } from "../shared";

@Injectable()
export class ModelConfigService {
  constructor(@InjectRepository(ModelConfigEntity) private repository: Repository<ModelConfigEntity>) {}

  @Transactional()
  async create(dto: CreateModelConfigDto, creatorId: string): Promise<void> {
    const config = this.repository.create({
      ...dto,
      creatorId,
      createTime: new Date(),
    });

    await this.repository.save(config);
  }

  async getGlobalConfig(): Promise<ModelConfig | null> {
    const config = await this.repository.findOne({
      where: { providerId: IsNull(), deleted: false },
      order: { updateTime: "DESC", createTime: "DESC" },
    });

    if (!config) {
      return null;
    }

    return ModelConfigSchema.parse({
      ...config,
      createTime: config.createTime.toISOString(),
      updateTime: config.updateTime?.toISOString() ?? null,
    });
  }

  async getProviderConfig(providerId: string): Promise<ModelConfig | null> {
    const config = await this.repository.findOne({
      where: { providerId, deleted: false },
      order: { updateTime: "DESC", createTime: "DESC" },
    });

    if (!config) {
      return null;
    }

    return ModelConfigSchema.parse({
      ...config,
      createTime: config.createTime.toISOString(),
      updateTime: config.updateTime?.toISOString() ?? null,
    });
  }

  async getEffectiveConfig(providerId?: string | null): Promise<ModelConfig | null> {
    if (providerId) {
      const providerConfig = await this.getProviderConfig(providerId);
      if (providerConfig) {
        return providerConfig;
      }
    }

    return this.getGlobalConfig();
  }

  @Transactional()
  async update(id: string, dto: UpdateModelConfigDto, userId: string): Promise<void> {
    const config = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!config) {
      throw new AppError(ErrorCode.MODEL_CONFIG_NOT_FOUND);
    }

    if (config.creatorId !== userId) {
      throw new AppError(ErrorCode.MODEL_CONFIG_ACCESS_DENIED);
    }

    await this.repository.update(id, {
      ...dto,
      updaterId: userId,
      updateTime: new Date(),
      // biome-ignore lint/suspicious/noExplicitAny: TypeORM update accepts partial entity with JSON fields
    } as any);
  }

  @Transactional()
  async delete(id: string, userId: string): Promise<void> {
    const config = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!config) {
      throw new AppError(ErrorCode.MODEL_CONFIG_NOT_FOUND);
    }

    if (config.creatorId !== userId) {
      throw new AppError(ErrorCode.MODEL_CONFIG_ACCESS_DENIED);
    }

    await this.repository.update({ id }, { deleted: true });
  }
}
