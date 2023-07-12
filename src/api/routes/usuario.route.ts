import { Router } from '../../deps.ts';
import usuarioController from '../../controllers/usuario.controller.ts';
import { authRole } from '../auth/authMiddleware.ts';
import { TipoUsuarioEnum } from '../../enums/tipoUsuario.enum.ts';

const router = new Router();

const USUARIO_API = '/api/usuario';

router.post(`${USUARIO_API}`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) }, 
  usuarioController.create);

router.get(`${USUARIO_API}/pesquisar`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) },
  usuarioController.pesquisar);

router.get(`${USUARIO_API}`, usuarioController.getAll);

router.get(`${USUARIO_API}/:id`, usuarioController.getById);

router.delete(`${USUARIO_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) }, 
  usuarioController.deleteById);

router.put(`${USUARIO_API}/:id`, 
  async (ctx, next) => { await authRole(ctx, next, TipoUsuarioEnum.ADMIN) }, 
  usuarioController.updateById);

  router.post(`${USUARIO_API}/alterar-senha`, usuarioController.alterarSenha);

export default router;