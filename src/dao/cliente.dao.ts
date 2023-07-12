import client from '../db/database.ts';
import Cliente from '../models/cliente.model.ts';

class ClienteDao {

  create(cliente: Cliente) {
    return client.queryObject<Cliente>(`INSERT INTO cliente 
      (codigo, nome, email, febraban, telefone, tecnicoresponsavel) 
      VALUES (
        ${cliente.codigo ? `'${cliente.codigo}'` : null}, 
        ${cliente.nome ? `'${cliente.nome}'` : null}, 
        ${cliente.email ? `'${cliente.email}'` : null},
        ${cliente.febraban ? `'${cliente.febraban}'` : null},
        ${cliente.telefone ? `'${cliente.telefone}'` : null},
        ${cliente.tecnicoresponsavel ? `'${cliente.tecnicoresponsavel}'` : null}
      ) RETURNING id`);
  }

  findById(id: number) {
    return client.queryObject<Cliente>(`SELECT * FROM cliente WHERE id = ${id}`);
  }

  findAll() {
    return client.queryArray<Cliente[]>('SELECT * FROM cliente');
  }

  delete(id: number) {
    return client.queryObject(`DELETE FROM cliente WHERE id = ${id}`);
  }

  update(id: number, cliente: Cliente) {
    let query = `UPDATE cliente SET 
      codigo = ${cliente.codigo ? `'${cliente.codigo}'` : null}, 
      nome = ${cliente.nome ? `'${cliente.nome}'` : null}, 
      email = ${cliente.email ? `'${cliente.email}'` : null},
      febraban = ${cliente.febraban ? `'${cliente.febraban}'` : null},
      telefone = ${cliente.telefone ? `'${cliente.telefone}'` : null},
      tecnicoresponsavel = ${cliente.tecnicoresponsavel ? `'${cliente.tecnicoresponsavel}'` : null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }

  pesquisar(texto: string) {
    return client.queryArray(`SELECT * FROM cliente 
      WHERE codigo ILIKE '%${texto}%' 
      OR email ILIKE '%${texto}%' 
      OR nome ILIKE '%${texto}%' 
      OR febraban ILIKE '%${texto}%'`);
  }
}

export default new ClienteDao();