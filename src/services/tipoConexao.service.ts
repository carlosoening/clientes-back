import TipoConexao from '../models/tipoConexao.model.ts';
import tipoConexaoDao from '../dao/tipoConexao.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class TipoConexaoService {

  async create(tipoConexao: TipoConexao) {
    const value = await tipoConexaoDao.create(tipoConexao);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await tipoConexaoDao.findById(id);
    let tipoConexao: TipoConexao = new TipoConexao();
    value.rows.map((v) => {
      tipoConexao = v;
    });
    if (!tipoConexao?.id) {
      throw new EntidadeNaoEncontradaError(`Tipo de Conexão não encontrado com o id: ${id}`);
    }
    return tipoConexao;
  }
  
  async getAll() {
    const value = await tipoConexaoDao.findAll();
    let tipoConexoes = new Array<TipoConexao>();
    value.rows.map(v => {
      let tipoConexao: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        tipoConexao[el.name] = v[i];
      });
      tipoConexoes.push(tipoConexao);
    });
    return tipoConexoes;
  }
  
  async delete(id: number) {
    await tipoConexaoDao.delete(id);
  }
  
  async update(id: number, tipoConexao: TipoConexao) {
    const latestTipoConexao = await this.getById(id);
  
    if (!latestTipoConexao?.id) {
      throw new EntidadeNaoEncontradaError(`Tipo de Conexão não encontrado com o id: ${id}`);
    }
  
    const updatedTipoConexao: TipoConexao = {
      codigo: tipoConexao.codigo || latestTipoConexao.codigo,
      nome: tipoConexao.nome || latestTipoConexao.nome
    }
  
    await tipoConexaoDao.update(id, updatedTipoConexao);
  }

  async pesquisar(texto: string) {
    if (!texto) {
      return [];
    }
    const value = await tipoConexaoDao.pesquisar(texto);
    let tiposConexao = new Array<TipoConexao>();
    value.rows.map(v => {
      let tipoConexao: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        tipoConexao[el.name] = v[i];
      });
      tiposConexao.push(tipoConexao);
    });
    return tiposConexao;
  }
}

export default new TipoConexaoService()