import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { AppError, Transactional } from "@meta-1/nest-common";
import type { ModelProvider } from "@meta-1/wiki-types";
import { ModelProviderSchema } from "@meta-1/wiki-types";
import { CreateModelProviderDto, UpdateModelProviderDto } from "../dto";
import { Model as ModelEntity, ModelProvider as ModelProviderEntity } from "../entity";
import { ErrorCode } from "../shared";

@Injectable()
export class ModelProviderService {
  constructor(
    @InjectRepository(ModelProviderEntity) private repository: Repository<ModelProviderEntity>,
    @InjectRepository(ModelEntity) private modelRepository: Repository<ModelEntity>,
  ) {}

  @Transactional()
  async create(dto: CreateModelProviderDto, creatorId: string): Promise<void> {
    const existingProvider = await this.repository.findOne({
      where: { platform: dto.platform, creatorId, deleted: false },
    });

    if (existingProvider) {
      throw new AppError(ErrorCode.MODEL_PROVIDER_PLATFORM_EXISTS);
    }

    const provider = this.repository.create({
      ...dto,
      creatorId,
      createTime: new Date(),
    });

    await this.repository.save(provider);
  }

  async list(creatorId: string): Promise<ModelProvider[]> {
    const providers = await this.repository.find({
      where: { creatorId, deleted: false },
      order: { updateTime: "DESC", createTime: "DESC" },
    });

    const providerIds = providers.map((p) => p.id);
    const models = await this.modelRepository.find({
      where: { providerId: In(providerIds), creatorId, deleted: false },
      select: ["providerId", "type"],
    });

    const modelTypesMap = new Map<string, Set<string>>();
    models.forEach((model) => {
      if (!modelTypesMap.has(model.providerId)) {
        modelTypesMap.set(model.providerId, new Set());
      }
      modelTypesMap.get(model.providerId)!.add(model.type);
    });

    return providers.map((provider) =>
      ModelProviderSchema.parse({
        ...provider,
        modelTypes: Array.from(modelTypesMap.get(provider.id) || []),
        createTime: provider.createTime.toISOString(),
        updateTime: provider.updateTime?.toISOString() ?? null,
      }),
    );
  }

  async getById(id: string): Promise<ModelProvider> {
    const provider = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!provider) {
      throw new AppError(ErrorCode.MODEL_PROVIDER_NOT_FOUND);
    }

    return ModelProviderSchema.parse({
      ...provider,
      createTime: provider.createTime.toISOString(),
      updateTime: provider.updateTime?.toISOString() ?? null,
    });
  }

  @Transactional()
  async update(id: string, dto: UpdateModelProviderDto, userId: string): Promise<void> {
    const provider = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!provider) {
      throw new AppError(ErrorCode.MODEL_PROVIDER_NOT_FOUND);
    }

    if (provider.creatorId !== userId) {
      throw new AppError(ErrorCode.MODEL_PROVIDER_ACCESS_DENIED);
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
    const provider = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!provider) {
      throw new AppError(ErrorCode.MODEL_PROVIDER_NOT_FOUND);
    }

    if (provider.creatorId !== userId) {
      throw new AppError(ErrorCode.MODEL_PROVIDER_ACCESS_DENIED);
    }

    await this.repository.update({ id }, { deleted: true });
  }
}
