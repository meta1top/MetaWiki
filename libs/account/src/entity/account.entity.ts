import { Column, Entity } from "typeorm";

import { SnowflakeId } from "@meta-1/nest-common";

@Entity({
  name: "account",
  comment: "账号",
})
export class Account {
  @SnowflakeId()
  id: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "邮箱",
    unique: true,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "用户名",
  })
  username: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    select: false,
    comment: "密码",
  })
  password: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "头像",
  })
  avatar: string | null;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    comment: "创建时间",
  })
  createTime: Date;

  @Column({
    type: "datetime",
    nullable: true,
    comment: "最后活动时间",
  })
  lastTime: Date | null;

  @Column({
    default: false,
    select: false,
    comment: "是否已删除",
  })
  deleted: boolean;

  @Column({
    default: true,
    comment: "是否启用",
  })
  enable: boolean;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    select: false,
    comment: "OTP密钥",
  })
  otpSecret: string | null;

  @Column({
    type: "int",
    default: 0,
    comment: "OTP绑定状态: 0 未绑定 1 已绑定",
  })
  otpStatus: number;

  @Column({
    type: "datetime",
    nullable: true,
    comment: "OTP生效时间",
  })
  otpEnableTime: Date | null;
}
