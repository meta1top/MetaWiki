-- 迁移脚本：为知识库表添加模型字段
-- 执行时间：2025-12-03
-- 说明：添加 embeddingModelId 和 rerankModelId 字段，并将 path 字段改为可空（向后兼容）

-- 1. 添加 embeddingModelId 字段
ALTER TABLE `wiki_repo`
ADD COLUMN `embedding_model_id` VARCHAR(20) NULL COMMENT 'Embedding 模型ID' AFTER `cover`;

-- 2. 添加 rerankModelId 字段
ALTER TABLE `wiki_repo`
ADD COLUMN `rerank_model_id` VARCHAR(20) NULL COMMENT '重排模型ID' AFTER `embedding_model_id`;

-- 3. 将 path 字段改为可空（向后兼容）
ALTER TABLE `wiki_repo`
MODIFY COLUMN `path` VARCHAR(500) NULL COMMENT '访问路径（兼容字段，已废弃）';

-- 回滚脚本（如果需要回滚）
-- ALTER TABLE `wiki_repo` DROP COLUMN `rerank_model_id`;
-- ALTER TABLE `wiki_repo` DROP COLUMN `embedding_model_id`;
-- ALTER TABLE `wiki_repo` MODIFY COLUMN `path` VARCHAR(500) NOT NULL COMMENT '访问路径';

