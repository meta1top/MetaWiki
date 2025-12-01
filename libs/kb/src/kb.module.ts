import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "@meta-1/nest-common";
import { WikiRepoController } from "./controller";
import { WikiRepo } from "./entity";
import { WikiRepoService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([WikiRepo]), CommonModule],
  controllers: [WikiRepoController],
  providers: [WikiRepoService],
  exports: [WikiRepoService],
})
export class KnowledgeBaseModule {}
