import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "@meta-1/nest-common";
import { Repository } from "./entity";

@Module({
  imports: [TypeOrmModule.forFeature([Repository]), CommonModule],
  providers: [],
  exports: [],
})
export class RepositoryModule {}
