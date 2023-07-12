import { Router } from '../../deps.ts';
import sqlController from '../../controllers/sql.controller.ts';
import { TipoUsuarioEnum } from '../../enums/tipoUsuario.enum.ts';
import { authRole } from '../auth/authMiddleware.ts';

const router = new Router();

const SQL_API = '/api/sql';

router.post(`${SQL_API}`,
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  sqlController.create);

router.get(`${SQL_API}/pesquisar`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  sqlController.pesquisar);

router.get(`${SQL_API}`, sqlController.getAll);

router.get(`${SQL_API}/:id`, sqlController.getById);

router.delete(`${SQL_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  sqlController.deleteById);

router.put(`${SQL_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  sqlController.updateById);


export default router;