import TipoServidor from '../models/tipoServidor.model.ts';
import tipoServidorDao from '../dao/tipoServidor.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class TipoServidorService {

  async create(tipoServidor: TipoServidor) {
    const value = await tipoServidorDao.create(tipoServidor);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await tipoServidorDao.findById(id);
    let tipoServidor: TipoServidor = new TipoServidor();
    value.rows.map((v) => {
      tipoServidor = v;
    });
    if (!tipoServidor?.id) {
      throw new EntidadeNaoEncontradaError(`Tipo de Servidor não encontrado com o id: ${id}`);
    }
    return tipoServidor;
  }
  
  async getAll() {
    const value = await tipoServidorDao.findAll();
    let tipoServidores = new Array<TipoServidor>();
    value.rows.map(v => {
      let tipoServidor: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        tipoServidor[el.name] = v[i];
      });
      tipoServidores.push(tipoServidor);
    });
    return tipoServidores;
  }
  
  async delete(id: number) {
    await tipoServidorDao.delete(id);
  }
  
  async update(id: number, tipoServidor: TipoServidor) {
    const latestTipoServidor = await this.getById(id);
  
    if (!latestTipoServidor?.id) {
      throw new EntidadeNaoEncontradaError(`Tipo de Servidor não encontrado com o id: ${id}`);
    }
  
    const updatedTipoServidor: TipoServidor = {
      codigo: tipoServidor.codigo || latestTipoServidor.codigo,
      nome: tipoServidor.nome || latestTipoServidor.nome
    }
  
    await tipoServidorDao.update(id, updatedTipoServidor);
  }

  async pesquisar(texto: string) {
    if (!texto) {
      return [];
    }
    const value = await tipoServidorDao.pesquisar(texto);
    let tiposServidor = new Array<TipoServidor>();
    value.rows.map(v => {
      let tipoServidor: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        tipoServidor[el.name] = v[i];
      });
      tiposServidor.push(tipoServidor);
    });
    return tiposServidor;
  }
}

export default new TipoServidorService()