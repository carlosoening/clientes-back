import client from '../db/database.ts';
import Sql from '../models/sql.model.ts';

class SqlDao {

  create(sql: Sql) {
    return client.queryObject<Sql>(`INSERT INTO sql (codigo, descricao, sql) 
      VALUES (
        ${sql.codigo ? `'${sql.codigo}'` : null}, 
        ${sql.descricao ? `'${sql.descricao}'` : null}, 
        ${sql.sql ? `$string$${sql.sql}$string$` : null}
      ) RETURNING id`);
  }
  
  findById(id: number) {
    return client.queryObject<Sql>(`SELECT * FROM sql WHERE id = ${id}`);
  }

  findAll() {
    return client.queryArray<Sql[]>('SELECT * FROM sql');
  }

  delete(id: number) {
    return client.queryObject<void>(`DELETE FROM sql WHERE id = ${id}`);
  }

  update(id: number, sql: Sql) {
    let query = `UPDATE sql SET 
      codigo = ${sql.codigo ? `'${sql.codigo}'` : null}, 
      descricao = ${sql.descricao ? `'${sql.descricao}'` : null}, 
      sql = ${sql.sql ? `$string$${sql.sql}$string$` : null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }

  pesquisar(texto: string) {
    return client.queryArray(`SELECT * FROM sql 
      WHERE codigo ILIKE '%${texto}%' 
      OR descricao ILIKE '%${texto}%' 
      OR sql ILIKE '%${texto}%'`);
  }
}

export default new SqlDao();