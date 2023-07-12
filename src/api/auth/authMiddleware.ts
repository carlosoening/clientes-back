import Context from '../../interfaces/context.interface.ts';
import { Status, verifyJwt, Request } from '../../deps.ts';
import { key, getPayloadFromToken, getAuthorizationToken } from '../../utils/jwt.ts';

export const authUser = async (ctx: Context, next: any) => {
  try {
    const jwt = getAuthorizationToken(ctx.request);
    await verifyJwt(jwt, key);
  } catch (error) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: 'Token JWT inválido' };
    return;
  }
  await next();
}

export const authRole = async (ctx: Context, next: any, role: string) => {
  try {
    const jwt = getAuthorizationToken(ctx.request);
    const payload: any = getPayloadFromToken(jwt);
    if (payload.role !== role) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { message: 'Não autorizado' };
      return;
    }
  } catch (error) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: error?.message };
    return;
  }
  await next();
}