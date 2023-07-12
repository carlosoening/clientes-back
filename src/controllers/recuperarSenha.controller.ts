import { Status, hashSync, compareSync, createJwt, getNumericDate, verifyJwt } from '../deps.ts';
import Context from '../interfaces/context.interface.ts';
import usuarioService from '../services/usuario.service.ts';
import emailService from '../services/email.service.ts';
import tokenUsuarioService from '../services/tokenUsuario.service.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';
import { key, header } from '../utils/jwt.ts';

export const enviarEmailRecuperarSenha = async ({ request, response }: Context) => {
  if (!request.hasBody) {
    response.body = { message: 'Dados inválidos' };
    response.status = Status.BadRequest;
    return;
  }
  const body: any = await request.body().value;
  if (!body.email) {
    response.body = { message: 'E-mail inválido' };
    response.status = Status.BadRequest;
    return;
  }
  if (!body.baseUrl) {
    response.body = { message: 'URL base inválido' };
    response.status = Status.BadRequest;
    return;
  }

  try {
    const usuario = await usuarioService.getByEmail(body.email);
    const EXP_TEN_MINUTES = 60 * 10;
    const jwt = await createJwt(header, { exp: getNumericDate(EXP_TEN_MINUTES) }, key);
    const token = hashSync(jwt);
    if (usuario?.id) {
      tokenUsuarioService.update(usuario.id, token);
    }
    const subject = 'Recuperação de senha';
    const html = `
      <html>
        <head>
          <style>
          </style>
        </head>
        <body>
          <p>Olá ${usuario.nome},</p>
          <p>Você solicitou a redefinição da sua senha.</p>
          <p> Por favor, clique no link abaixo para redefinir a sua senha</p>
          <a href="${body.baseUrl}/recuperar-senha?token=${jwt}&usuarioId=${usuario.id}">Redefinir Senha</a>
        </body>
      </html>`;
    await emailService.enviarEmail(String(body.email), subject, subject, html);
  } catch (error: any) {

    if (error instanceof EntidadeNaoEncontradaError) {
      response.body = { message: error?.message };
      response.status = Status.NotFound;
      return;
    }
    response.body = { message: error?.message };
    response.status = Status.InternalServerError;
    return;
  }

  response.status = Status.OK;
  response.body = { message: 'E-mail enviado com sucesso!' };
}

export const redefinirSenha = async ({ request, response }: Context) => {
  if (!request.hasBody) {
    response.body = { message: 'Dados inválidos' };
    response.status = Status.BadRequest;
    return;
  }
  const body: any = await request.body().value;
  if (!body.token) {
    response.body = { message: 'Token inválido' };
    response.status = Status.BadRequest;
    return;
  }
  if (!body.usuarioId) {
    response.body = { message: 'ID do usuário inválido' };
    response.status = Status.BadRequest;
    return;
  }
  if (!body.senha) {
    response.body = { message: 'Senha inválida' };
    response.status = Status.BadRequest;
    return;
  }

  try {
    const usuario = await usuarioService.getById(body.usuarioId);
    if (!usuario?.id || !usuario?.codigo) {
      response.body = { message: 'Usuário não encontrado' };
      response.status = Status.BadRequest;
      return;
    }
    const tokenUsuario = await tokenUsuarioService.getByUsuarioId(body.usuarioId);
    if (!tokenUsuario || !tokenUsuario.token) {
      response.body = { message: 'Token de redefinição de senha inválido ou expirado' };
      response.status = Status.BadRequest;
      return;
    }
    const valido = compareSync(body.token, tokenUsuario.token);
    if (!valido) {
      response.body = { message: 'Token de redefinição de senha inválido ou expirado' };
      response.status = Status.UnprocessableEntity;
      return;
    }
    try {
      await verifyJwt(body.token, key);
    } catch (error) {
      response.body = { message: 'Token de redefinição de senha inválido ou expirado' };
      response.status = Status.UnprocessableEntity;
      return;
    }
    await usuarioService.alterarSenha(usuario.codigo, body.senha);
    await tokenUsuarioService.deleteByUsuarioId(usuario.id);
  } catch (error) {
    response.body = { message: error?.message };
    response.status = Status.InternalServerError;
    return;
  }

  response.status = Status.OK;
  response.body = { message: 'Senha redefinida com sucesso!' };
}