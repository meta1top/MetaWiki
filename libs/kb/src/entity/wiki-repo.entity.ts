import { Column, Entity } from "typeorm";

import { SnowflakeId } from "@meta-1/nest-common";

@Entity({
  name: "wiki_repo",
  comment: "知识库",
})
export class WikiRepo {
  @SnowflakeId()
  id: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "名称",
  })
  name: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
    comment: "访问路径（兼容字段，已废弃）",
  })
  path: string | null;

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
    type: "varchar",
    length: 500,
    nullable: true,
    comment: "封面",
  })
  cover: string | null;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    comment: "Embedding 模型ID",
  })
  embeddingModelId: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    comment: "重排模型ID",
  })
  rerankModelId: string;

  @Column({
    type: "tinyint",
    width: 1,
    default: false,
    select: false,
    comment: "是否已删除",
  })
  deleted: boolean;
}
