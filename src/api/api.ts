import { Router } from '../deps.ts';
import usuario from './routes/usuario.route.ts';
import sql from './routes/sql.route.ts';
import login from './routes/login.route.ts';
import recuperarSenha from './routes/recuperarSenha.route.ts';
import cliente from './routes/cliente.route.ts';
import tipoConexao from './routes/tipoConexao.route.ts';
import tipoServidor from './routes/tipoServidor.route.ts';
import relatorioBackup from './routes/relatorioBackup.route.ts';
import { authUser } from './auth/authMiddleware.ts';

const router = new Router();

router.get("/api", (ctx) => {
    ctx.response.body = "API is working!"
});

router.use(login.routes());
router.use(recuperarSenha.routes());

// Camada de autenticação
router.use(authUser);

router.use(usuario.routes());
router.use(sql.routes());
router.use(cliente.routes());
router.use(tipoConexao.routes());
router.use(tipoServidor.routes());
router.use(tipoServidor.routes());
router.use(relatorioBackup.routes());

export default router;
