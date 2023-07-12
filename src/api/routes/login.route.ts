import { Router } from '../../deps.ts';
import { login } from '../auth/login.ts';

const router = new Router();

const LOGIN_API = '/api/login';

router.post(`${LOGIN_API}`, login);

export default router;