import Contato from '../models/contato.model.ts';
import contatoDao from '../dao/contato.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class ContatoService {

  async create(contato: Contato) {
    const value = await contatoDao.create(contato);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await contatoDao.findById(id);
    let contato: Contato = new Contato();
    value.rows.map((v) => {
      contato = v;
    });
    if (!contato?.id) {
      throw new EntidadeNaoEncontradaError(`Contato não encontrado com o id: ${id}`);
    }
    return contato;
  }

  async getByClienteId(id: number) {
    const value = await contatoDao.findByClienteId(id);
    let contatos = new Array<Contato>();
    value.rows.map(v => {
      let contato: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        contato[el.name] = v[i];
      });
      contatos.push(contato);
    });
    return contatos;
  }
  
  async getAll() {
    const value = await contatoDao.findAll();
    let contatos = new Array<Contato>();
    value.rows.map(v => {
      let contato: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        contato[el.name] = v[i];
      });
      contatos.push(contato);
    });
    return contatos;
  }
  
  async delete(id: number) {
    await contatoDao.delete(id);
  }

  async deleteByClienteId(id: number) {
    await contatoDao.deleteByClienteId(id);
  }
  
  async update(id: number, contato: Contato) {
    const latestContato = await this.getById(id);
  
    if (!latestContato?.id) {
      throw new EntidadeNaoEncontradaError(`Contato não encontrado com o id: ${id}`);
    }
  
    const updatedContato: Contato = {
      nome: contato.nome || latestContato.nome,
      email: contato.email || latestContato.email,
      telefone: contato.telefone || latestContato.telefone,
      cliente_id: contato.cliente_id || latestContato.cliente_id
    }
  
    await contatoDao.update(id, updatedContato);
  }
}

export default new ContatoService()