import Conexao from '../models/conexao.model.ts';
import conexaoDao from '../dao/conexao.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class ConexaoService {

  async create(conexao: Conexao) {
    const value = await conexaoDao.create(conexao);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await conexaoDao.findById(id);
    let conexao: Conexao = new Conexao();
    value.rows.map((v) => {
      conexao = v;
    });
    if (!conexao?.id) {
      throw new EntidadeNaoEncontradaError(`Conexão não encontrada com o id: ${id}`);
    }
    return conexao;
  }
  
  async getByClienteId(id: number) {
    const value = await conexaoDao.findByClienteId(id);
    let conexoes = new Array<Conexao>();
    value.rows.map(v => {
      let conexao: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        conexao[el.name] = v[i];
      });
      conexoes.push(conexao);
    });
    return conexoes;
  }

  async getAll() {
    const value = await conexaoDao.findAll();
    let conexoes = new Array<Conexao>();
    value.rows.map(v => {
      let conexao: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        conexao[el.name] = v[i];
      });
      conexoes.push(conexao);
    });
    return conexoes;
  }
  
  async delete(id: number) {
    await conexaoDao.delete(id);
  }

  async deleteByClienteId(id: number) {
    await conexaoDao.deleteByClienteId(id);
  }
  
  async update(id: number, conexao: Conexao) {
    const latestConexao = await this.getById(id);
  
    if (!latestConexao?.id) {
      throw new EntidadeNaoEncontradaError(`Conexão não encontrada com o id: ${id}`);
    }
  
    const updatedConexao: Conexao = {
      tipoconexao_id: conexao.tipoconexao_id || latestConexao.tipoconexao_id,
      ip: conexao.ip || latestConexao.ip,
      usuario: conexao.usuario || latestConexao.usuario,
      senha: conexao.senha || latestConexao.senha,
      cliente_id: conexao.cliente_id || latestConexao.cliente_id
    }
  
    await conexaoDao.update(id, updatedConexao);
  }
}

export default new ConexaoService()