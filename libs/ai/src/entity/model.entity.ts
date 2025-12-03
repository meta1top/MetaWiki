import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { SnowflakeId } from "@meta-1/nest-common";
import { ModelProvider } from "./model-provider.entity";

@Entity({
  name: "model",
  comment: "模型",
})
export class Model {
  @SnowflakeId()
  id: string;

  @Column({
    type: "varchar",
    length: 20,
    comment: "模型提供商ID",
  })
  providerId: string;

  @ManyToOne(
    () => ModelProvider,
    (provider) => provider.models,
  )
  @JoinColumn({ name: "providerId" })
  provider: ModelProvider;

  @Column({
    type: "varchar",
    length: 255,
    comment: "模型名称",
  })
  name: string;

  @Column({
    type: "varchar",
    length: 50,
    comment: "模型类型",
  })
  type: string;

  @Column({
    type: "int",
    nullable: true,
    comment: "上下文长度",
  })
  contextLength: number | null;

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
