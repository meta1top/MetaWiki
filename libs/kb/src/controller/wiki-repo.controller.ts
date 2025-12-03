import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser, type SessionUser } from "@meta-1/nest-security";
import type { WikiRepo, WikiRepoDetail } from "@meta-1/wiki-types";
import { CreateWikiRepoDto, UpdateWikiRepoDto, WikiRepoDetailDto, WikiRepoDto } from "../dto";
import { WikiRepoService } from "../service";

@ApiTags("WikiRepoController")
@Controller("/api/wiki/repo")
export class WikiRepoController {
  constructor(private readonly wikiRepoService: WikiRepoService) {}

  @Get("/list")
  @ApiOperation({ summary: "获取知识库列表" })
  @ApiResponse({
    status: 200,
    type: [WikiRepoDto],
  })
  list(@CurrentUser() user: SessionUser): Promise<WikiRepo[]> {
    return this.wikiRepoService.list(user.id);
  }

  @Post("/create")
  @ApiOperation({ summary: "创建知识库" })
  create(@Body() dto: CreateWikiRepoDto, @CurrentUser() user: SessionUser): Promise<void> {
    return this.wikiRepoService.create(dto, user.id);
  }

  @Get("/:path")
  @ApiOperation({ summary: "根据路径获取知识库详情" })
  @ApiParam({ name: "path", description: "知识库访问路径" })
  @ApiResponse({
    status: 200,
    type: WikiRepoDetailDto,
  })
  getByPath(@Param("path") path: string): Promise<WikiRepoDetail> {
    return this.wikiRepoService.getByPath(path);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "更新知识库" })
  @ApiParam({ name: "id", description: "知识库ID" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
  })
  update(@Param("id") id: string, @Body() dto: UpdateWikiRepoDto, @CurrentUser() user: SessionUser): Promise<void> {
    return this.wikiRepoService.update(id, dto, user.id);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "删除知识库" })
  @ApiParam({ name: "id", description: "知识库ID" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
  })
  delete(@Param("id") id: string, @CurrentUser() user: SessionUser): Promise<void> {
    return this.wikiRepoService.delete(id, user.id);
  }
}
