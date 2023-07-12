import { Status, log } from '../deps.ts';
import sqlService from '../services/sql.service.ts';
import Sql from '../models/sql.model.ts';
import Context from '../interfaces/context.interface.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';
import { AuditController } from '../core/controller/audit.controller.ts';
import { TipoOperacaoEnum } from "../enums/tipoOperacao.enum.ts";

class SqlController extends AuditController {

  constructor() {
    super('sql');
  }

  create = async ({ request, response }: Context) => {
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: "Dados de SQL inválidos" };
      return;
    }
    const body = await request.body().value;
    try {
      const novoSql: Sql = body;
      const sqlId = await sqlService.create(novoSql);
      await super.auditChanges(request, TipoOperacaoEnum.CREATE, sqlId);
      response.status = Status.BadRequest;
      response.status = Status.Created;
      response.body = { success: true, id: sqlId, message: 'SQL criado com sucesso' };
    } catch (error: any) {
      log.error(error?.message);
      if (error.message.includes(Sql.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
        response.status = Status.Conflict;
        response.body = { message: 'Código de SQL já existe' };
      } else {
        response.status = Status.InternalServerError;
        response.body = { message: error?.message };
      }
    }
  }
  
  getById = async ({ response, params }: Context) => {
    if (!params?.id) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do SQL inválido' };
      return;
    }
    try {
      const sql = await sqlService.getById(Number(params.id));
      response.body = sql;
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
      response.body = await sqlService.getAll();
    } catch (error) {
      log.error(error?.message);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    } 
  }
  
  deleteById = async ({ request, response, params }: Context) => {
    const sqlId = params.id;
    if (!sqlId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do SQL inválido' };
      return;
    }
    try {
      await sqlService.getById(Number(params.id));
      await sqlService.delete(Number(params.id));
      await super.auditChanges(request, TipoOperacaoEnum.DELETE, sqlId);
      response.body = { message: 'SQL removido' };
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
    const sqlId = params?.id;
    
    if (!sqlId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do SQL inválido' };
      return;
    }
  
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: 'Dados de SQL inválidos' };
      return;
    }
  
    const sql: Sql = await request.body().value;
    try {
      await sqlService.update(sqlId, sql);
      await super.auditChanges(request, TipoOperacaoEnum.UPDATE, sqlId);
      response.body = { message: 'SQL atualizado com sucesso' }; 
    } catch (error) {
      log.error(error?.message);
      if (error instanceof EntidadeNaoEncontradaError) {
        response.status = Status.NotFound;
        response.body = { message: error?.message };
      } else {
        if (error.message.includes(Sql.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
          response.status = Status.Conflict;
          response.body = { message: 'Código de SQL já existe' };
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
      response.body = await sqlService.getAll();
      return;
    }
    try {
      response.body = await sqlService.pesquisar(texto);
    } catch (error) {
      log.error(error);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }
  }
}

export default new SqlController();