import { Router } from 'express';
import { InfoCardController } from '../controllers/infoCardController';

const router = Router();
const infoCardController = new InfoCardController();

// 健康检查
router.get('/health', infoCardController.healthCheck);

// 获取支持的 AI 提供商
router.get('/providers', infoCardController.getSupportedProviders);

// 提取信息并生成卡片
router.post('/extract', infoCardController.extractInfo);

export default router;