import { Status, hashSync, log, compareSync } from '../deps.ts';
import usuarioService from '../services/usuario.service.ts';
import Usuario from '../models/usuario.model.ts';
import Context from '../interfaces/context.interface.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';
import { AuditController } from '../core/controller/audit.controller.ts';
import { TipoOperacaoEnum } from '../enums/tipoOperacao.enum.ts';
import { AlterarSenhaDto } from "../dtos/alterar-senha.dto.ts";
import { getAuthorizationToken, getPayloadFromToken } from '../utils/jwt.ts';

class UsuarioController extends AuditController {

  constructor() {
    super('usuario');
  }

  create = async ({ request, response }: Context) => {
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: "Dados de usuário inválidos" };
      return;
    }
    const body = await request.body().value;
    try {
      const novoUsuario: Usuario = body;
      novoUsuario.senha = hashSync(body.senha)
      const usuarioId = await usuarioService.create(novoUsuario);
      await super.auditChanges(request, TipoOperacaoEnum.CREATE, usuarioId);
      response.status = Status.Created;
      response.body = { success: true, id: usuarioId, message: 'Usuário criado com sucesso' };
    } catch (error: any) {
      log.error(error?.message);
      if (error.message.includes(Usuario.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
        response.status = Status.Conflict;
        response.body = { message: 'Código de usuário já existe' };
      } else if (error.message.includes(Usuario.EMAIL_UNIQUE_CONSTRAINT_NAME)) {
        response.status = Status.Conflict;
        response.body = { message: 'E-mail de usuário já existe' };
      } else {
        response.status = Status.InternalServerError;
        response.body = { message: error?.message };
      }
    }
  }
  
  getById = async ({ response, params }: Context) => {
    if (!params?.id) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do usuário inválido' };
      return;
    }
    try {
      const usuario = await usuarioService.getById(Number(params.id));
      delete usuario.senha;
      response.body = usuario;
    } catch (error) {
      log.error(error?.message);
      if (error instanceof EntidadeNaoEncontradaError) {
        response.status = Status.NotFound;
      } else {
        response.status = Status.InternalServerError;
      }
      response.body = { message: error?.message };
    }
  }
  
  getAll = async ({ response }: Context) => {
    try {
      response.body = await usuarioService.getAll();
    } catch (error) {
      log.error(error?.message);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }
  }
  
  deleteById = async ({ request, response, params }: Context) => {
    const usuarioId = params?.id
    
    if (!usuarioId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do usuário inválido' };
      return;
    }
    
    try {
      await usuarioService.getById(usuarioId);
      await usuarioService.delete(usuarioId);
      await super.auditChanges(request, TipoOperacaoEnum.DELETE, usuarioId);
      response.body = { message: 'Usuário removido' };
    } catch (error) {
      log.error(error?.message);
      if (error instanceof EntidadeNaoEncontradaError) {
        response.status = Status.NotFound;
      } else {
        response.status = Status.InternalServerError;
      }
      response.body = { message: error?.message };
    }
  }
  
  updateById = async ({request, response, params}: Context) => {
    const usuarioId = params?.id;
    
    if (!usuarioId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do usuário inválido' };
      return;
    }
  
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: 'Dados de usuário inválidos' };
      return;
    }
  
    const usuario: Usuario = await request.body().value;
    try {
      await usuarioService.update(usuarioId, usuario);
      await super.auditChanges(request, TipoOperacaoEnum.UPDATE, usuarioId);
      response.body = { message: 'Usuário atualizado com sucesso' };
    } catch (error) {
      log.error(error?.message);
      if (error instanceof EntidadeNaoEncontradaError) {
        response.status = Status.NotFound;
        response.body = { message: error?.message };
      } else {
        if (error.message.includes(Usuario.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
          response.status = Status.Conflict;
          response.body = { message: 'Código de usuário já existe' };
        } else if (error.message.includes(Usuario.EMAIL_UNIQUE_CONSTRAINT_NAME)) {
          response.status = Status.Conflict;
          response.body = { message: 'E-mail de usuário já existe' };
        } else {
          response.status = Status.InternalServerError;
          response.body = { message: error?.message };
        }
      }
    }
  }

  alterarSenha = async ({request, response}: Context) => {
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: 'Dados de alterar senha inválidos' };
      return;
    }
    const dadosAlterarSenha: AlterarSenhaDto = await request.body().value;
    try {
      const token = getAuthorizationToken(request);
      const payload: any = getPayloadFromToken(token);
      const usuario = await usuarioService.getByCodigo(payload.sub);
      const senhaValida = compareSync(String(dadosAlterarSenha.senhaAtual), String(usuario.senha));
      if (!senhaValida) {
        const message = 'Senha atual incorreta!';
        log.error(message);
        response.status = Status.UnprocessableEntity;
        response.body = { message };
        return;
      }
      if (dadosAlterarSenha.senhaAtual === dadosAlterarSenha.novaSenha) {
        const message = 'Nova senha é igual à atual!';
        log.error(message);
        response.status = Status.UnprocessableEntity;
        response.body = { message };
        return;
      }
      await usuarioService.alterarSenha(payload.sub, dadosAlterarSenha.novaSenha);
      response.body = { message: 'Senha alterada com sucesso!' };
    } catch (error) {
      log.error(error?.message);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }
  }

  pesquisar = async ({ request, response }: Context) => {
    const texto: any = request?.url?.searchParams?.get('texto');
    if (!texto) {
      response.body = await usuarioService.getAll();
      return;
    }
    try {
      response.body = await usuarioService.pesquisar(texto);
    } catch (error) {
      log.error(error);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }
  }

}

export default new UsuarioController();