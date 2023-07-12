import { Router } from '../../deps.ts';
import tipoServidorController from '../../controllers/tipoServidor.controller.ts';
import { TipoUsuarioEnum } from '../../enums/tipoUsuario.enum.ts';
import { authRole } from '../auth/authMiddleware.ts';

const router = new Router();

const TIPOSERVIDOR_API = '/api/tiposervidor';

router.post(`${TIPOSERVIDOR_API}`,
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoServidorController.create);

router.get(`${TIPOSERVIDOR_API}/pesquisar`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoServidorController.pesquisar);

router.get(`${TIPOSERVIDOR_API}`, tipoServidorController.getAll);

router.get(`${TIPOSERVIDOR_API}/:id`, tipoServidorController.getById);

router.delete(`${TIPOSERVIDOR_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoServidorController.deleteById);

router.put(`${TIPOSERVIDOR_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  tipoServidorController.updateById);

export default router;