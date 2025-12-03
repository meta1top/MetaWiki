import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser, type SessionUser } from "@meta-1/nest-security";
import type { ModelConfig } from "@meta-1/wiki-types";
import { CreateModelConfigDto, ModelConfigDto, UpdateModelConfigDto } from "../dto";
import { ModelConfigService } from "../service";

@ApiTags("ModelConfigController")
@Controller("/api/ai/model-config")
export class ModelConfigController {
  constructor(private readonly modelConfigService: ModelConfigService) {}

  @Get("/global")
  @ApiOperation({ summary: "获取全局模型配置" })
  @ApiResponse({
    status: 200,
    type: ModelConfigDto,
  })
  getGlobalConfig(): Promise<ModelConfig | null> {
    return this.modelConfigService.getGlobalConfig();
  }

  @Get("/provider/:providerId")
  @ApiOperation({ summary: "获取提供商级别的模型配置" })
  @ApiParam({ name: "providerId", description: "模型提供商ID" })
  @ApiResponse({
    status: 200,
    type: ModelConfigDto,
  })
  getProviderConfig(@Param("providerId") providerId: string): Promise<ModelConfig | null> {
    return this.modelConfigService.getProviderConfig(providerId);
  }

  @Post("/create")
  @ApiOperation({ summary: "创建模型配置" })
  create(@Body() dto: CreateModelConfigDto, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelConfigService.create(dto, user.id);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "更新模型配置" })
  @ApiParam({ name: "id", description: "模型配置ID" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
  })
  update(@Param("id") id: string, @Body() dto: UpdateModelConfigDto, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelConfigService.update(id, dto, user.id);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "删除模型配置" })
  @ApiParam({ name: "id", description: "模型配置ID" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
  })
  delete(@Param("id") id: string, @CurrentUser() user: SessionUser): Promise<void> {
    return this.modelConfigService.delete(id, user.id);
  }
}
