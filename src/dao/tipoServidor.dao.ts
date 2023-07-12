import client from '../db/database.ts';
import TipoServidor from '../models/tipoServidor.model.ts';

class TipoServidorDao {

  create(tipoServidor: TipoServidor) {
    return client.queryObject<TipoServidor>(`INSERT INTO tiposervidor 
      (codigo, nome) 
      VALUES (
        ${tipoServidor.codigo ? `'${tipoServidor.codigo}'` : null},
        ${tipoServidor.nome ? `'${tipoServidor.nome}'` : null}
      ) RETURNING id`);
  }

  findById(id: number) {
    return client.queryObject<TipoServidor>(`SELECT * FROM tiposervidor WHERE id = ${id}`);
  }

  findAll() {
    return client.queryArray<TipoServidor[]>('SELECT * FROM tiposervidor');
  }

  delete(id: number) {
    return client.queryObject(`DELETE FROM tiposervidor WHERE id = ${id}`);
  }

  update(id: number, tipoServidor: TipoServidor) {
    let query = `UPDATE tiposervidor SET 
      codigo = ${tipoServidor.codigo ? `'${tipoServidor.codigo}'` : null}, 
      nome = ${tipoServidor.nome ? `'${tipoServidor.nome}'` : null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }

  pesquisar(texto: string) {
    return client.queryArray(`SELECT * FROM tiposervidor 
      WHERE codigo ILIKE '%${texto}%' 
      OR nome ILIKE '%${texto}%'`);
  }
}

export default new TipoServidorDao();