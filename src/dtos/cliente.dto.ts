import Cliente from '../models/cliente.model.ts';
import Contato from '../models/contato.model.ts';
import Conexao from '../models/conexao.model.ts';
import Sistema from '../models/sistema.model.ts';
import BackupConfig from '../models/backupConfig.model.ts';

class ClienteDto {

  constructor(
    public id?: number,
    public codigo?: string,
    public nome?: string,
    public email?: string,
    public febraban?: string,
    public telefone?: string,
    public tecnicoresponsavel?: string,
    public contatos?: Contato[],
    public conexoes?: Conexao[],
    public sistemas?: Sistema[],
    public backupconfigs?: BackupConfig[],
    public idsBackupConfigsExcluir?: number[],
    public idsContatosExcluir?: number[],
    public idsConexoesExcluir?: number[],
    public idsSistemasExcluir?: number[],
  ) {}
  
  public getCliente(): Cliente {
    const cliente = new Cliente();
    cliente.id = this.id;
    cliente.codigo = this.codigo;
    cliente.nome = this.nome;
    cliente.email = this.email;
    cliente.febraban = this.febraban;
    cliente.telefone = this.telefone;
    cliente.tecnicoresponsavel = this.tecnicoresponsavel;
    return cliente;
  }

  public static of(cliente: Cliente, contatos?: any, conexoes?: any, sistemas?: any, backupconfigs?: any): ClienteDto {
    const dto = new ClienteDto();
    dto.id = cliente.id;
    dto.codigo = cliente.codigo;
    dto.nome = cliente.nome;
    dto.email = cliente.email;
    dto.febraban = cliente.febraban;
    dto.telefone = cliente.telefone;
    dto.tecnicoresponsavel = cliente.tecnicoresponsavel;
    dto.contatos = contatos;
    dto.conexoes = conexoes;
    dto.sistemas = sistemas;
    dto.backupconfigs = backupconfigs;
    return dto;
  }

  public static fromBody(body: any): ClienteDto {
    const dto = new ClienteDto();
    dto.id = body.id;
    dto.codigo = body.codigo;
    dto.nome = body.nome;
    dto.email = body.email;
    dto.febraban = body.febraban;
    dto.telefone = body.telefone;
    dto.tecnicoresponsavel = body.tecnicoresponsavel;
    dto.contatos = body.contatos;
    dto.conexoes = body.conexoes;
    dto.sistemas = body.sistemas;
    dto.backupconfigs = body.backupconfigs;
    dto.idsBackupConfigsExcluir = body.idsBackupConfigsExcluir;
    dto.idsConexoesExcluir = body.idsConexoesExcluir;
    dto.idsContatosExcluir = body.idsContatosExcluir;
    dto.idsSistemasExcluir = body.idsSistemasExcluir;
    return dto;
  }

}

export default ClienteDto;