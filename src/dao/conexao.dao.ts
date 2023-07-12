import client from '../db/database.ts';
import Conexao from '../models/conexao.model.ts';

class ConexaoDao {

  create(conexao: Conexao) {
    return client.queryObject<Conexao>(`INSERT INTO conexao 
      (tipoconexao_id, ip, usuario, senha, cliente_id) 
      VALUES (
        ${conexao.tipoconexao_id || null}, 
        ${conexao.ip ? `'${conexao.ip}'` : null}, 
        ${conexao.usuario ? `'${conexao.usuario}'` : null},
        ${conexao.senha ? `'${conexao.senha}'` : null},
        ${conexao.cliente_id || null}
      ) RETURNING id`);
  }

  findById(id: number) {
    return client.queryObject<Conexao>(`SELECT * FROM conexao WHERE id = ${id}`);
  }

  findByClienteId(id: number) {
    return client.queryArray<Conexao[]>(`SELECT * FROM conexao WHERE cliente_id = ${id} ORDER BY id`);
  }

  findAll() {
    return client.queryArray<Conexao[]>('SELECT * FROM conexao ORDER BY id');
  }

  delete(id: number) {
    return client.queryObject(`DELETE FROM conexao WHERE id = ${id}`);
  }

  deleteByClienteId(id: number) {
    return client.queryObject(`DELETE FROM conexao WHERE cliente_id = ${id}`);
  }

  update(id: number, conexao: Conexao) {
    let query = `UPDATE conexao SET 
      tipoconexao_id = ${conexao.tipoconexao_id || null}, 
      ip = ${conexao.ip ? `'${conexao.ip}'` : null}, 
      usuario = ${conexao.usuario ? `'${conexao.usuario}'` : null},
      senha = ${conexao.senha ? `'${conexao.senha}'` : null},
      cliente_id = ${conexao.cliente_id || null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }
}

export default new ConexaoDao();