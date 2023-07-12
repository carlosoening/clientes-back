import { Status, log } from '../deps.ts';
import clienteService from '../services/cliente.service.ts';
import contatoService from '../services/contato.service.ts';
import conexaoService from '../services/conexao.service.ts';
import sistemaService from '../services/sistema.service.ts';
import backupConfigService from '../services/backupConfig.service.ts';
import Cliente from '../models/cliente.model.ts';
import Context from '../interfaces/context.interface.ts';
import ClienteDto from '../dtos/cliente.dto.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';
import { AuditController } from '../core/controller/audit.controller.ts';
import { TipoOperacaoEnum } from "../enums/tipoOperacao.enum.ts";
import { VERSAO_GSAN } from '../utils/regex.ts';

class ClienteController extends AuditController {

  constructor() {
    super('cliente');
  }

  create = async ({ request, response }: Context) => {
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: "Dados de cliente inválidos" };
      return;
    }
    const body: ClienteDto = await request.body().value;
    try {
      const clienteDto: ClienteDto = ClienteDto.fromBody(body);

      const novoCliente: Cliente = clienteDto.getCliente();
      const clienteId = await clienteService.create(novoCliente);
      const contatos = clienteDto.contatos;
      if (contatos && contatos.length > 0) {
        contatos.forEach(async contato => {
          contato.cliente_id = clienteId;
          await contatoService.create(contato);
        });
      }
      const conexoes = clienteDto.conexoes;
      if (conexoes && conexoes.length > 0) {
        conexoes.forEach(async conexao => {
          conexao.cliente_id = clienteId;
          await conexaoService.create(conexao);
        });
      }
      const sistemas = clienteDto.sistemas;
      if (sistemas && sistemas.length > 0) {
        sistemas.forEach(async sistema => {
          sistema.cliente_id = clienteId;
          await sistemaService.create(sistema);
        });
      }
      const backupConfigs = clienteDto.backupconfigs;
      if (backupConfigs && backupConfigs.length > 0) {
        backupConfigs.forEach(async backupConfig => {
          backupConfig.cliente_id = clienteId;
          await backupConfigService.create(backupConfig);
        });
      }
      await super.auditChanges(request, TipoOperacaoEnum.CREATE, clienteId);
      response.status = Status.Created;
      response.body = { success: true, id: clienteId, message: 'Cliente criado com sucesso' };
    } catch (error: any) {
      log.error(error);
      if (error.message.includes(Cliente.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
        response.status = Status.Conflict;
        response.body = { message: 'Código de cliente já existe' };
      } else {
        response.status = Status.InternalServerError;
        response.body = { message: error?.message };
      }
    }
  }
  
  getById = async ({ response, params }: Context) => {
    const id = params?.id;
    if (!id) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do cliente inválido' };
      return;
    }
    try {
      const cliente = await clienteService.getById(Number(id));
      const conexoes = await conexaoService.getByClienteId(Number(id));
      const backupconfigs = await backupConfigService.getByClienteId(Number(id));
      const contatos = await contatoService.getByClienteId(Number(id));
      const sistemas = await sistemaService.getByClienteId(Number(id));

      response.body = ClienteDto.of(cliente, contatos, conexoes, sistemas, backupconfigs);
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
      let clientesDto = new Array<ClienteDto>();
      const clientes = await clienteService.getAll();
      for (let cliente of clientes) {
        const conexoes = await conexaoService.getByClienteId(Number(cliente.id));
        const backupconfigs = await backupConfigService.getByClienteId(Number(cliente.id));
        const contatos = await contatoService.getByClienteId(Number(cliente.id));
        const sistemas = await sistemaService.getByClienteId(Number(cliente.id));
        clientesDto.push(ClienteDto.of(cliente, contatos, conexoes, sistemas, backupconfigs));
      }
      response.body = clientesDto;
    } catch (error) {
      log.error(error?.message);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    } 
  }
  
  deleteById = async ({ request, response, params }: Context) => {
    const clienteId: number = params.id;
    if (!clienteId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do cliente inválido' };
      return;
    }
    try {
      await clienteService.getById(clienteId);
      await backupConfigService.deleteByClienteId(clienteId);
      await conexaoService.deleteByClienteId(clienteId);
      await contatoService.deleteByClienteId(clienteId);
      await sistemaService.deleteByClienteId(clienteId);
      await clienteService.delete(clienteId);
      await super.auditChanges(request, TipoOperacaoEnum.DELETE, clienteId);
      response.body = { message: 'Cliente removido' };
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
    const clienteId = params?.id;
    
    if (!clienteId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do cliente inválido' };
      return;
    }
  
    if (!request.hasBody) {
      response.status = Status.BadRequest;
      response.body = { message: 'Dados de cliente inválidos' };
      return;
    }
  
    const body: ClienteDto = await request.body().value;
    const clienteDto = ClienteDto.fromBody(body);
    try {
      const cliente = clienteDto.getCliente();
      await clienteService.update(clienteId, cliente);
      const contatos = clienteDto.contatos;
      const conexoes = clienteDto.conexoes;
      const sistemas = clienteDto.sistemas;
      const backupconfigs = clienteDto.backupconfigs;

      // Verificar se há itens para excluir
      if (clienteDto.idsBackupConfigsExcluir) {
        for (const id of clienteDto.idsBackupConfigsExcluir) {
          await backupConfigService.delete(id);
        }
      }
      if (clienteDto.idsConexoesExcluir) {
        for (const id of clienteDto.idsConexoesExcluir) {
          await conexaoService.delete(id);
        }
      }
      if (clienteDto.idsContatosExcluir) {
        for (const id of clienteDto.idsContatosExcluir) {
          await contatoService.delete(id);
        }
      }
      if (clienteDto.idsSistemasExcluir) {
        for (const id of clienteDto.idsSistemasExcluir) {
          await sistemaService.delete(id);
        }
      }
      // FIM - Verificar se há itens para excluir

      if (contatos) {
        for (const contato of contatos) {
          if (contato.id) {
            await contatoService.update(contato.id, contato);
          } else {
            contato.cliente_id = clienteId;
            await contatoService.create(contato);
          }
        }
      }
      if (conexoes) {
        for (const conexao of conexoes) {
          if (conexao.id) {
            await conexaoService.update(conexao.id, conexao);
          } else {
            conexao.cliente_id = clienteId;
            await conexaoService.create(conexao);
          }
        }
      }
      if (sistemas) {
        for (const sistema of sistemas) {
          if (sistema.id) {
            await sistemaService.update(sistema.id, sistema);
          } else {
            sistema.cliente_id = clienteId;
            await sistemaService.create(sistema);
          }
        }
      }
      if (backupconfigs) {
        for (const backupconfig of backupconfigs) {
          if (backupconfig.id) {
            await backupConfigService.update(backupconfig.id, backupconfig);
          } else {
            backupconfig.cliente_id = clienteId;
            await backupConfigService.create(backupconfig);
          }
        }
      }
      await super.auditChanges(request, TipoOperacaoEnum.UPDATE, clienteId);
      response.body = { message: 'Cliente atualizado com sucesso' }; 
    } catch (error) {
      log.error(error?.message);
      if (error instanceof EntidadeNaoEncontradaError) {
        response.status = Status.NotFound;
        response.body = { message: error?.message };
      } else {
        if (error.message.includes(Cliente.CODIGO_UNIQUE_CONSTRAINT_NAME)) {
          response.status = Status.Conflict;
          response.body = { message: 'Código de cliente já existe' };
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
      response.body = await clienteService.getAll();
      return;
    }
    try {
      response.body = await clienteService.pesquisar(texto);
    } catch (error) {
      log.error(error);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }
  }

  buscarVersaoGsan = async ({ response, params }: Context) => {
    const clienteId = params.id;
    if (!clienteId) {
      response.status = Status.BadRequest;
      response.body = { message: 'Id do cliente inválido' };
      return;
    }
    try {
      const sistemas = await sistemaService.getTipoGsanByClienteId(clienteId);
      if (!sistemas) {
        response.status = Status.NotFound;
        response.body = { message: 'Nenhum sistema do tipo \"GSAN\" foi encontrado' };
      }
      for (let sistema of sistemas) {
        if (sistema.url) {
          let requestGsan: any = null;
          try {
            requestGsan = await fetch(sistema.url);
          } catch (error) {
            continue;
          }
          if (requestGsan.ok) {
            const paginaGsan = await requestGsan.text();
            const match = paginaGsan.match(VERSAO_GSAN);
            if (match) {
              const versaoGsan = match[0];
              response.body = { versaoGsan };
              return;
            }
          }
        }
      }
      response.status = Status.NotFound;
      response.body = { message: 'Não foi possível encontrar a versão do GSAN' };
    } catch (error) {
      log.error(error?.message);
      response.status = Status.InternalServerError;
      response.body = { message: error?.message };
    }

  }
}

export default new ClienteController()