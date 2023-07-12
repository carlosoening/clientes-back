import { Router } from '../../deps.ts';
import clienteController from '../../controllers/cliente.controller.ts';
import { TipoUsuarioEnum } from '../../enums/tipoUsuario.enum.ts';
import { authRole } from '../auth/authMiddleware.ts';

const router = new Router();

const CLIENTE_API = '/api/cliente';

router.post(`${CLIENTE_API}`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  clienteController.create);

router.get(`${CLIENTE_API}/pesquisar`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  clienteController.pesquisar);

router.get(`${CLIENTE_API}/buscar-versao/gsan/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  clienteController.buscarVersaoGsan);

router.get(`${CLIENTE_API}`, clienteController.getAll);

router.get(`${CLIENTE_API}/:id`, clienteController.getById);

router.delete(`${CLIENTE_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  clienteController.deleteById);

router.put(`${CLIENTE_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  clienteController.updateById);

export default router;