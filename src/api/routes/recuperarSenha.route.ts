import { Router } from '../../deps.ts';
import { enviarEmailRecuperarSenha, redefinirSenha } from '../../controllers/recuperarSenha.controller.ts';

const router = new Router();

const RECUPERAR_SENHA_API = '/api/recuperar-senha';

router.post(`${RECUPERAR_SENHA_API}/enviar-email`, enviarEmailRecuperarSenha);

router.post(`${RECUPERAR_SENHA_API}/redefinir-senha`, redefinirSenha);

export default router;