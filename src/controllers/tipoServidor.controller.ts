import { Status, log } from '../deps.ts';
import tipoServidorService from '../services/tipoServidor.service.ts';
import TipoServidor from '../models/tipoServidor.model.ts';
import Context from '../interfaces/context.interface.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';
import { AuditController } from '../core/controller/audit.controller.ts';
import { TipoOperacaoEnum } from "../enums/tipoOperacao.enum.ts";

class TipoServidorController extends AuditController {

  constructor() {
    super('tiposervidor');
  }

  create = async ({ request, response }: Context) => {
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: "Dados de Tipo de Servidor inválidos" };
      return;
    }
    const body = await request.body().value;
    try {
      const novoTipoServidor: TipoServidor = body;
      const tipoServidorId = await tipoServidorService.create(novoTipoServidor);
      await super.auditChanges(request, TipoOperacaoEnum.CREATE, tipoServidorId);
      response.status = Status.BadRequest;
      response.status = Status.Created;
      response.body = { success: true, id: tipoServidorId, message: 'Tipo de Servidor criado com sucesso' };
    } catch (error: any) {
      log.error(error?.message);
      if (error.message.includes(TipoServidor.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
        response.status = Status.Conflict;
        response.body = { message: 'Código de Tipo de Servidor já existe' };
      } else {
        response.status = Status.InternalServerError;
        response.body = { message: error?.message };
      }
    }
  }
  
  getById = async ({ response, params }: Context) => {
    if (!params?.id) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do Tipo de Servidor inválido' };
      return;
    }
    try {
      const tipoServidor = await tipoServidorService.getById(Number(params.id));
      response.body = tipoServidor;
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
      response.body = await tipoServidorService.getAll();
    } catch (error) {
      log.error(error?.message);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    } 
  }
  
  deleteById = async ({ request, response, params }: Context) => {
    const tipoServidorId = params.id;
    if (!tipoServidorId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do Tipo de Servidor inválido' };
      return;
    }
    try {
      await tipoServidorService.getById(Number(params.id));
      await tipoServidorService.delete(Number(params.id));
      await super.auditChanges(request, TipoOperacaoEnum.DELETE, tipoServidorId);
      response.body = { message: 'Tipo de Servidor removido' };
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
    const tipoServidorId = params?.id;
    
    if (!tipoServidorId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do Tipo de Servidor inválido' };
      return;
    }
  
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: 'Dados de Tipo de Servidor inválidos' };
      return;
    }
  
    const tipoServidor: TipoServidor = await request.body().value;
    try {
      await tipoServidorService.update(tipoServidorId, tipoServidor);
      await super.auditChanges(request, TipoOperacaoEnum.UPDATE, tipoServidorId);
      response.body = { message: 'Tipo de Servidor atualizado com sucesso' }; 
    } catch (error) {
      log.error(error?.message);
      if (error instanceof EntidadeNaoEncontradaError) {
        response.status = Status.NotFound;
        response.body = { message: error?.message };
      } else {
        if (error.message.includes(TipoServidor.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
          response.status = Status.Conflict;
          response.body = { message: 'Código de Tipo de Servidor já existe' };
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
      response.body = await tipoServidorService.getAll();
      return;
    }
    try {
      response.body = await tipoServidorService.pesquisar(texto);
    } catch (error) {
      log.error(error);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }
  }
}

export default new TipoServidorController();