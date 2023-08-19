import { Status, compareSync, log, Context } from '../../deps.ts';
import usuarioService from '../../services/usuario.service.ts';
import Usuario from '../../models/usuario.model.ts';
import Login from '../../dtos/login.dto.ts';
import { getNewToken } from '../../utils/jwt.ts';
import { REGEX_EMAIL_VALIDATION } from '../../utils/regex.ts';
import { auditLogin } from '../../core/controller/audit.controller.ts';
import { TipoOperacaoEnum } from '../../enums/tipoOperacao.enum.ts';

export const login = async (ctx: Context) => {
  try {
    if (!ctx.request.hasBody) {
      const message = 'Dados de login inválidos';
      log.error(message);
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message };
      return;
    }
  
    const body: Login = await ctx.request.body().value;

    if (!body.usuario || !body.senha) {
      const message = 'Dados de login inválidos';
      log.error({ message, body });
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message };
      return;
    }
  
    let usuario: Usuario = new Usuario();

    // Verifica se está logando com email ou com código do usuário
    if (REGEX_EMAIL_VALIDATION.test(String(body.usuario))) {
      usuario = await usuarioService.getByEmail(body.usuario);
    } else {
      usuario = await usuarioService.getByCodigo(body.usuario);
    }
  
    if (!usuario?.id) {
      const message = 'Usuário ou senha inválidos';
      log.error({ message, usuario: body.usuario });
      ctx.response.status = Status.NotFound;
      ctx.response.body = { message };
      return;
    }

    const senhaValida = compareSync(String(body.senha), String(usuario.senha));
  
    if (!senhaValida) {
      const message = 'Usuário ou senha inválidos';
      log.error({ message, usuario: body.usuario });
      ctx.response.status = Status.UnprocessableEntity;
      ctx.response.body = { message };
      return;
    }
    
    if (!usuario.ativo) {
      const message = 'Usuário está desativado';
      log.error({ message, usuario: body.usuario });
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { message };
      return;
    }

    const jwt = await getNewToken(String(usuario.codigo), String(usuario.tipo));
  
    if (jwt) {
      const token = {
        message: 'Usuário autenticado com sucesso',
        username: usuario.codigo,
        token: jwt
      };
      auditLogin(ctx.request, TipoOperacaoEnum.LOGIN, String(usuario.codigo))
      ctx.response.body = token;
    }
  } catch (error) {
    log.error(error);
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = { message: error?.message };
  }

}