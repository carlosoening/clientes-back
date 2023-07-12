import { Router } from '../../deps.ts';
import relatorioBackupController from '../../controllers/relatorioBackup.controller.ts';

const router = new Router();

const RELATORIO_BACKUP_API = '/api/relatorio-backup';

router.post(`${RELATORIO_BACKUP_API}`, relatorioBackupController.geraRelatorioBackup);

export default router;