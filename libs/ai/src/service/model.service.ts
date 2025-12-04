import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AppError, Transactional } from "@meta-1/nest-common";
import type { Model } from "@meta-1/wiki-types";
import { ModelSchema } from "@meta-1/wiki-types";
import { CreateModelDto, UpdateModelDto } from "../dto";
import { Model as ModelEntity } from "../entity";
import { ErrorCode } from "../shared";

@Injectable()
export class ModelService {
  constructor(@InjectRepository(ModelEntity) private repository: Repository<ModelEntity>) {}

  @Transactional()
  async create(dto: CreateModelDto, creatorId: string): Promise<void> {
    const model = this.repository.create({
      ...dto,
      creatorId,
      createTime: new Date(),
    });

    await this.repository.save(model);
  }

  async list(creatorId: string, providerId?: string): Promise<Model[]> {
    const where: { creatorId: string; deleted: boolean; providerId?: string } = {
      creatorId,
      deleted: false,
    };

    if (providerId) {
      where.providerId = providerId;
    }

    const models = await this.repository.find({
      where,
      order: { createTime: "DESC" },
    });

    return models.map((model) =>
      ModelSchema.parse({
        ...model,
        functionCalling: Boolean(model.functionCalling),
        enabled: Boolean(model.enabled),
        createTime: model.createTime.toISOString(),
        updateTime: model.updateTime?.toISOString() ?? null,
      }),
    );
  }

  async getById(id: string): Promise<Model> {
    const model = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!model) {
      throw new AppError(ErrorCode.MODEL_NOT_FOUND);
    }

    return ModelSchema.parse({
      ...model,
      functionCalling: Boolean(model.functionCalling),
      enabled: Boolean(model.enabled),
      createTime: model.createTime.toISOString(),
      updateTime: model.updateTime?.toISOString() ?? null,
    });
  }

  @Transactional()
  async update(id: string, dto: UpdateModelDto, userId: string): Promise<void> {
    const model = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!model) {
      throw new AppError(ErrorCode.MODEL_NOT_FOUND);
    }

    if (model.creatorId !== userId) {
      throw new AppError(ErrorCode.MODEL_ACCESS_DENIED);
    }

    await this.repository.update(id, {
      ...dto,
      updaterId: userId,
      updateTime: new Date(),
    });
  }

  @Transactional()
  async delete(id: string, userId: string): Promise<void> {
    const model = await this.repository.findOne({
      where: { id, deleted: false },
    });

    if (!model) {
      throw new AppError(ErrorCode.MODEL_NOT_FOUND);
    }

    if (model.creatorId !== userId) {
      throw new AppError(ErrorCode.MODEL_ACCESS_DENIED);
    }

    await this.repository.update({ id }, { deleted: true });
  }
}
