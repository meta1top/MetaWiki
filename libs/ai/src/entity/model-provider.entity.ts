import { Column, Entity, OneToMany } from "typeorm";

import { SnowflakeId } from "@meta-1/nest-common";
import { Model } from "./model.entity";
import { ModelConfig } from "./model-config.entity";

@Entity({
  name: "model_provider",
  comment: "模型提供商",
})
export class ModelProvider {
  @SnowflakeId()
  id: string;

  @Column({
    type: "varchar",
    length: 50,
    comment: "平台类型",
  })
  platform: string;

  @Column({
    type: "varchar",
    length: 1000,
    comment: "API Key",
  })
  apiKey: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
    comment: "API Base URL",
  })
  apiBaseUrl: string | null;

  @Column({
    type: "json",
    nullable: true,
    comment: "通用配置字段（JSON）",
  })
  config: Record<string, unknown> | null;

  @Column({
    type: "text",
    nullable: true,
    comment: "描述",
  })
  description: string | null;

  @Column({
    type: "varchar",
    length: 20,
    comment: "创建人Id",
  })
  creatorId: string;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    comment: "创建时间",
  })
  createTime: Date;

  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
    comment: "更新人Id",
  })
  updaterId: string | null;

  @Column({
    type: "datetime",
    nullable: true,
    onUpdate: "CURRENT_TIMESTAMP",
    comment: "更新时间",
  })
  updateTime: Date | null;

  @Column({
    type: "tinyint",
    width: 1,
    default: false,
    select: false,
    comment: "是否已删除",
  })
  deleted: boolean;

  @OneToMany(
    () => Model,
    (model) => model.provider,
  )
  models: Model[];

  @OneToMany(
    () => ModelConfig,
    (config) => config.provider,
  )
  configs: ModelConfig[];
}
