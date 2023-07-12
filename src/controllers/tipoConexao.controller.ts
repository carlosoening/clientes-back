import { Status, log } from '../deps.ts';
import tipoConexaoService from '../services/tipoConexao.service.ts';
import TipoConexao from '../models/tipoConexao.model.ts';
import Context from '../interfaces/context.interface.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';
import { AuditController } from '../core/controller/audit.controller.ts';
import { TipoOperacaoEnum } from "../enums/tipoOperacao.enum.ts";

class TipoConexaoController extends AuditController {

  constructor() {
    super('tipoconexao');
  }

  create = async ({ request, response }: Context) => {
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: "Dados de Tipo de Conexão inválidos" };
      return;
    }
    const body = await request.body().value;
    try {
      const novoTipoConexao: TipoConexao = body;
      const tipoConexaoId = await tipoConexaoService.create(novoTipoConexao);
      await super.auditChanges(request, TipoOperacaoEnum.CREATE, tipoConexaoId);
      response.status = Status.BadRequest;
      response.status = Status.Created;
      response.body = { success: true, id: tipoConexaoId, message: 'Tipo de Conexão criado com sucesso' };
    } catch (error: any) {
      log.error(error?.message);
      if (error.message.includes(TipoConexao.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
        response.status = Status.Conflict;
        response.body = { message: 'Código de Tipo de Conexão já existe' };
      } else {
        response.status = Status.InternalServerError;
        response.body = { message: error?.message };
      }
    }
  }
  
  getById = async ({ response, params }: Context) => {
    if (!params?.id) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do Tipo de Conexão inválido' };
      return;
    }
    try {
      const tipoConexao = await tipoConexaoService.getById(Number(params.id));
      response.body = tipoConexao;
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
      response.body = await tipoConexaoService.getAll();
    } catch (error) {
      log.error(error?.message);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    } 
  }
  
  deleteById = async ({ request, response, params }: Context) => {
    const tipoConexaoId = params.id;
    if (!tipoConexaoId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do Tipo de Conexão inválido' };
      return;
    }
    try {
      await tipoConexaoService.getById(Number(params.id));
      await tipoConexaoService.delete(Number(params.id));
      await super.auditChanges(request, TipoOperacaoEnum.DELETE, tipoConexaoId);
      response.body = { message: 'Tipo de Conexão removido' };
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
    const tipoConexaoId = params?.id;
    
    if (!tipoConexaoId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do Tipo de Conexão inválido' };
      return;
    }
  
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: 'Dados de Tipo de Conexão inválidos' };
      return;
    }
  
    const tipoConexao: TipoConexao = await request.body().value;
    try {
      await tipoConexaoService.update(tipoConexaoId, tipoConexao);
      await super.auditChanges(request, TipoOperacaoEnum.UPDATE, tipoConexaoId);
      response.body = { message: 'Tipo de Conexão atualizado com sucesso' }; 
    } catch (error) {
      log.error(error?.message);
      if (error instanceof EntidadeNaoEncontradaError) {
        response.status = Status.NotFound;
        response.body = { message: error?.message };
      } else {
        if (error.message.includes(TipoConexao.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
          response.status = Status.Conflict;
          response.body = { message: 'Código de Tipo de Conexão já existe' };
        } else {
          response.status = Status.InternalServerError;
          response.body = { message: error?.message };
        }
      }
    }
  }

  pesquisar = async ({ request, response }: Context) => {
    const texto: any = request?.url?.searchParams?.get('texto');
    if (!texto) {
      response.body = await tipoConexaoService.getAll();
      return;
    }
    try {
      response.body = await tipoConexaoService.pesquisar(texto);
    } catch (error) {
      log.error(error);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }
  }
}

export default new TipoConexaoController();