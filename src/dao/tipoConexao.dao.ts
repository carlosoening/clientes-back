import client from '../db/database.ts';
import TipoConexao from '../models/tipoConexao.model.ts';

class TipoConexaoDao {

  create(tipoConexao: TipoConexao) {
    return client.queryObject<TipoConexao>(`INSERT INTO tipoconexao 
      (codigo, nome) 
      VALUES (
        ${tipoConexao.codigo ? `'${tipoConexao.codigo}'` : null},
        ${tipoConexao.nome ? `'${tipoConexao.nome}'` : null}
      ) RETURNING id`);
  }

  findById(id: number) {
    return client.queryObject<TipoConexao>(`SELECT * FROM tipoconexao WHERE id = ${id}`);
  }

  findAll() {
    return client.queryArray<TipoConexao[]>('SELECT * FROM tipoconexao');
  }

  delete(id: number) {
    return client.queryObject(`DELETE FROM tipoconexao WHERE id = ${id}`);
  }

  update(id: number, tipoConexao: TipoConexao) {
    let query = `UPDATE tipoconexao SET 
      codigo = ${tipoConexao.codigo ? `'${tipoConexao.codigo}'` : null}, 
      nome = ${tipoConexao.nome ? `'${tipoConexao.nome}'` : null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }

  pesquisar(texto: string) {
    return client.queryArray(`SELECT * FROM tipoconexao 
      WHERE codigo ILIKE '%${texto}%' 
      OR nome ILIKE '%${texto}%'`);
  }
}

export default new TipoConexaoDao();