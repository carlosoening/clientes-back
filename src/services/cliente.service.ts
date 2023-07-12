import Cliente from '../models/cliente.model.ts';
import clienteDao from '../dao/cliente.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class ClienteService {

  async create(cliente: Cliente) {
    const value = await clienteDao.create(cliente);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await clienteDao.findById(id);
    let cliente: Cliente = new Cliente();
    value.rows.map((v) => {
      cliente = v;
    });
    if (!cliente?.id) {
      throw new EntidadeNaoEncontradaError(`Cliente não encontrado com o id: ${id}`);
    }
    return cliente;
  }
  
  async getAll() {
    const value = await clienteDao.findAll();
    let clientes = new Array<Cliente>();
    value.rows.map(v => {
      let cliente: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        cliente[el.name] = v[i];
      });
      clientes.push(cliente);
    });
    return clientes;
  }
  
  async delete(id: number) {
    await clienteDao.delete(id);
  }
  
  async update(id: number, cliente: Cliente) {
    const latestCliente = await this.getById(id);
  
    if (!latestCliente?.id) {
      throw new EntidadeNaoEncontradaError(`Cliente não encontrado com o id: ${id}`);
    }
  
    const updatedCliente: Cliente = {
      codigo: cliente.codigo || latestCliente.codigo,
      nome: cliente.nome || latestCliente.nome,
      email: cliente.email || latestCliente.email,
      febraban: cliente.febraban || latestCliente.febraban,
      telefone: cliente.telefone || latestCliente.telefone,
      tecnicoresponsavel: cliente.tecnicoresponsavel || latestCliente.tecnicoresponsavel
    }
  
    await clienteDao.update(id, updatedCliente);
  }

  async pesquisar(texto: string) {
    if (!texto) {
      return [];
    }
    const value = await clienteDao.pesquisar(texto);
    let clientes = new Array<Cliente>();
    value.rows.map(v => {
      let cliente: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        cliente[el.name] = v[i];
      });
      clientes.push(cliente);
    });
    return clientes;
  }
}

export default new ClienteService()