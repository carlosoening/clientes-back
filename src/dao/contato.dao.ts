import client from '../db/database.ts';
import Contato from '../models/contato.model.ts';

class ContatoDao {

  create(contato: Contato) {
    return client.queryObject<Contato>(`INSERT INTO contato 
      (nome, email, telefone, cliente_id) 
      VALUES (
        ${contato.nome ? `'${contato.nome}'` : null}, 
        ${contato.email ? `'${contato.email}'` : null}, 
        ${contato.telefone ? `'${contato.telefone}'` : null},
        ${contato.cliente_id || null}
      ) RETURNING id`);
  }

  findById(id: number) {
    return client.queryObject<Contato>(`SELECT * FROM contato WHERE id = ${id}`);
  }

  findByClienteId(id: number) {
    return client.queryArray<Contato[]>(`SELECT * FROM contato WHERE cliente_id = ${id} ORDER BY id`);
  }

  findAll() {
    return client.queryArray<Contato[]>('SELECT * FROM contato ORDER BY id');
  }

  delete(id: number) {
    return client.queryObject(`DELETE FROM contato WHERE id = ${id}`);
  }

  deleteByClienteId(id: number) {
    return client.queryObject(`DELETE FROM contato WHERE cliente_id = ${id}`);
  }

  update(id: number, contato: Contato) {
    let query = `UPDATE contato SET 
      nome = ${contato.nome ? `'${contato.nome}'` : null}, 
      email = ${contato.email ? `'${contato.email}'` : null}, 
      telefone = ${contato.telefone ? `'${contato.telefone}'` : null},
      cliente_id = ${contato.cliente_id || null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }
}

export default new ContatoDao();