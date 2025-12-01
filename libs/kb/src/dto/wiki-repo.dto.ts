import { createZodDto } from "nestjs-zod";

import { CreateWikiRepoSchema, WikiRepoDetailSchema, WikiRepoSchema } from "@meta-1/wiki-types";

export class CreateWikiRepoDto extends createZodDto(CreateWikiRepoSchema) {}

export class WikiRepoDto extends createZodDto(WikiRepoSchema) {}

export class WikiRepoDetailDto extends createZodDto(WikiRepoDetailSchema) {}
