import { Router } from '../../deps.ts';
import tipoConexaoController from '../../controllers/tipoConexao.controller.ts';
import { TipoUsuarioEnum } from '../../enums/tipoUsuario.enum.ts';
import { authRole } from '../auth/authMiddleware.ts';

const router = new Router();

const TIPOCONEXAO_API = '/api/tipoconexao';

router.post(`${TIPOCONEXAO_API}`,
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoConexaoController.create);

router.get(`${TIPOCONEXAO_API}/pesquisar`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoConexaoController.pesquisar);

router.get(`${TIPOCONEXAO_API}`, tipoConexaoController.getAll);

router.get(`${TIPOCONEXAO_API}/:id`, tipoConexaoController.getById);

router.delete(`${TIPOCONEXAO_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoConexaoController.deleteById);

router.put(`${TIPOCONEXAO_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoConexaoController.updateById);

export default router;