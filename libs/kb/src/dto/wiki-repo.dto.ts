import { createZodDto } from "nestjs-zod";

import { CreateWikiRepoSchema, UpdateWikiRepoSchema, WikiRepoDetailSchema, WikiRepoSchema } from "@meta-1/wiki-types";

export class CreateWikiRepoDto extends createZodDto(CreateWikiRepoSchema) {}

export class UpdateWikiRepoDto extends createZodDto(UpdateWikiRepoSchema) {}

export class WikiRepoDto extends createZodDto(WikiRepoSchema) {}

export class WikiRepoDetailDto extends createZodDto(WikiRepoDetailSchema) {}
