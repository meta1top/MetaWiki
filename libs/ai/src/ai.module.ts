import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "@meta-1/nest-common";
import { AiService } from "./ai.service";
import { ModelConfigController, ModelController, ModelProviderController } from "./controller";
import { Model, ModelConfig, ModelProvider } from "./entity";
import { ModelConfigService, ModelProviderService, ModelService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([ModelProvider, Model, ModelConfig]), CommonModule],
  controllers: [ModelProviderController, ModelController, ModelConfigController],
  providers: [AiService, ModelProviderService, ModelService, ModelConfigService],
  exports: [AiService, ModelProviderService, ModelService, ModelConfigService],
})
export class AiModule {}
