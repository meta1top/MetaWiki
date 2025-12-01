import { Column, Entity } from "typeorm";

import { SnowflakeId } from "@meta-1/nest-common";

@Entity({
  name: "account_token",
  comment: "账号令牌",
})
export class AccountToken {
  @SnowflakeId()
  id: string;

  @Column({
    type: "varchar",
    length: 20,
    comment: "账号ID",
  })
  accountId: string;

  @Column({
    type: "varchar",
    length: 20,
    comment: "应用ID",
  })
  appId: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "刷新令牌",
  })
  refreshToken: string | null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "访问令牌",
  })
  accessToken: string | null;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    comment: "创建时间",
  })
  createTime: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    comment: "更新时间",
  })
  updateTime: Date;
}
