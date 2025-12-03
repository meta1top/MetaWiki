import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { SnowflakeId } from "@meta-1/nest-common";
import { ModelProvider } from "./model-provider.entity";

@Entity({
  name: "model_config",
  comment: "模型配置",
})
export class ModelConfig {
  @SnowflakeId()
  id: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
    comment: "模型提供商ID（为空表示全局配置）",
  })
  providerId: string | null;

  @ManyToOne(
    () => ModelProvider,
    (provider) => provider.configs,
    { nullable: true },
  )
  @JoinColumn({ name: "providerId" })
  provider: ModelProvider | null;

  @Column({
    type: "decimal",
    precision: 3,
    scale: 2,
    nullable: true,
    comment: "温度",
  })
  temperature: number | null;

  @Column({
    type: "int",
    nullable: true,
    comment: "最大 token 数",
  })
  maxTokens: number | null;

  @Column({
    type: "decimal",
    precision: 3,
    scale: 2,
    nullable: true,
    comment: "核采样",
  })
  topP: number | null;

  @Column({
    type: "decimal",
    precision: 3,
    scale: 2,
    nullable: true,
    comment: "频率惩罚",
  })
  frequencyPenalty: number | null;

  @Column({
    type: "decimal",
    precision: 3,
    scale: 2,
    nullable: true,
    comment: "存在惩罚",
  })
  presencePenalty: number | null;

  @Column({
    type: "json",
    nullable: true,
    comment: "其他配置（JSON）",
  })
  otherConfig: Record<string, unknown> | null;

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
}
