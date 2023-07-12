import Sistema from '../models/sistema.model.ts';
import sistemaDao from '../dao/sistema.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class SistemaService {

  async create(sistema: Sistema) {
    const value = await sistemaDao.create(sistema);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await sistemaDao.findById(id);
    let sistema: Sistema = new Sistema();
    value.rows.map((v) => {
      sistema = v;
    });
    if (!sistema?.id) {
      throw new EntidadeNaoEncontradaError(`Sistema não encontrado com o id: ${id}`);
    }
    return sistema;
  }
  
  async getByClienteId(id: number) {
    const value = await sistemaDao.findByClienteId(id);
    let sistemas = new Array<Sistema>();
    value.rows.map(v => {
      let sistema: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        sistema[el.name] = v[i];
      });
      sistemas.push(sistema);
    });
    return sistemas;
  }

  async getAll() {
    const value = await sistemaDao.findAll();
    let sistemas = new Array<Sistema>();
    value.rows.map(v => {
      let sistema: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        sistema[el.name] = v[i];
      });
      sistemas.push(sistema);
    });
    return sistemas;
  }
  
  async delete(id: number) {
    await sistemaDao.delete(id);
  }
  
  async update(id: number, sistema: Sistema) {
    const latestSistema = await this.getById(id);
  
    if (!latestSistema?.id) {
      throw new EntidadeNaoEncontradaError(`Sistema não encontrado com o id: ${id}`);
    }
  
    const updatedSistema: Sistema = {
      nome: sistema.nome || latestSistema.nome,
      url: sistema.url || latestSistema.url,
      tipo: sistema.tipo || latestSistema.tipo,
      cliente_id: sistema.cliente_id || latestSistema.cliente_id,
      ordem: sistema.ordem || latestSistema.ordem
    }
  
    await sistemaDao.update(id, updatedSistema);
  }

  async deleteByClienteId(id: number) {
    await sistemaDao.deleteByClienteId(id);
  }

  async getTipoGsanByClienteId(id: number) {
    const value = await sistemaDao.findTipoGsanByClienteId(id);
    let sistemas = new Array<Sistema>();
    value.rows.map(v => {
      let sistema: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        sistema[el.name] = v[i];
      });
      sistemas.push(sistema);
    });
    return sistemas;
  }

  async getMaxOrdemByClienteId(id: number) {
    const value = await sistemaDao.findMaxOrdemByClienteId(id);
    let max: number = 0;
    value.rows.map((v) => {
      max = v;
    });
    if (!max) {
      return null;
    }
    return max;
  }
}

export default new SistemaService()