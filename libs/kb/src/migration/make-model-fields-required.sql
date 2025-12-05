-- 迁移脚本：将模型字段改为必填
-- 执行时间：2025-12-04
-- 说明：将 embeddingModelId 和 rerankModelId 字段改为 NOT NULL

-- 注意：执行此脚本前，请确保所有现有数据的模型字段都有值
-- 如果有 NULL 值，需要先更新这些数据

-- 1. 检查是否有 NULL 值的数据
-- SELECT COUNT(*) FROM `wiki_repo` WHERE `embedding_model_id` IS NULL OR `rerank_model_id` IS NULL;

-- 2. 如果有 NULL 值，需要先更新（请根据实际情况修改默认值）
-- UPDATE `wiki_repo` SET `embedding_model_id` = '默认模型ID' WHERE `embedding_model_id` IS NULL;
-- UPDATE `wiki_repo` SET `rerank_model_id` = '默认模型ID' WHERE `rerank_model_id` IS NULL;

-- 3. 将字段改为 NOT NULL
ALTER TABLE `wiki_repo`
MODIFY COLUMN `embedding_model_id` VARCHAR(20) NOT NULL COMMENT 'Embedding 模型ID';

ALTER TABLE `wiki_repo`
MODIFY COLUMN `rerank_model_id` VARCHAR(20) NOT NULL COMMENT '重排模型ID';

-- 回滚脚本（如果需要回滚）
-- ALTER TABLE `wiki_repo` MODIFY COLUMN `embedding_model_id` VARCHAR(20) NULL COMMENT 'Embedding 模型ID';
-- ALTER TABLE `wiki_repo` MODIFY COLUMN `rerank_model_id` VARCHAR(20) NULL COMMENT '重排模型ID';

