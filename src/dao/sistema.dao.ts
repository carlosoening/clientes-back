import client from '../db/database.ts';
import Sistema from '../models/sistema.model.ts';
import { TipoSistemaEnum } from '../enums/tipoSistema.enum.ts';

class SistemaDao {

  create(sistema: Sistema) {
    return client.queryObject<Sistema>(`INSERT INTO sistema 
      (nome, url, tipo, cliente_id, ordem) 
      VALUES (
        ${sistema.nome ? `'${sistema.nome}'` : null}, 
        ${sistema.url ? `'${sistema.url}'` : null}, 
        ${sistema.tipo ? `'${sistema.tipo}'` : TipoSistemaEnum.OUTRO}, 
        ${sistema.cliente_id || null},
        ${sistema.ordem || null}
      ) RETURNING id`);
  }

  findById(id: number) {
    return client.queryObject<Sistema>(`SELECT * FROM sistema WHERE id = ${id}`);
  }

  findByClienteId(id: number) {
    return client.queryArray<Sistema[]>(`SELECT * FROM sistema WHERE cliente_id = ${id} ORDER BY ordem, id`);
  }

  findAll() {
    return client.queryArray<Sistema[]>('SELECT * FROM sistema ORDER BY id');
  }

  delete(id: number) {
    return client.queryObject(`DELETE FROM sistema WHERE id = ${id}`);
  }

  deleteByClienteId(id: number) {
    return client.queryObject(`DELETE FROM sistema WHERE cliente_id = ${id}`);
  }

  update(id: number, sistema: Sistema) {
    let query = `UPDATE sistema SET 
      nome = ${sistema.nome ? `'${sistema.nome}'` : null}, 
      url = ${sistema.url ? `'${sistema.url}'` : null},
      tipo = ${sistema.tipo ? `'${sistema.tipo}'` : null}, 
      cliente_id = ${sistema.cliente_id || null},
      ordem = ${sistema.ordem || null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }

  findTipoGsanByClienteId(id: number) {
    return client.queryArray<Sistema[]>(`SELECT * FROM sistema 
    WHERE cliente_id = ${id} 
    AND tipo IN ('${TipoSistemaEnum.GSAN_INTERNO}', '${TipoSistemaEnum.GSAN_EXTERNO}') ORDER BY id`);
  }

  findMaxOrdemByClienteId(id: number) {
    return client.queryObject<number>(`SELECT MAX(ordem) FROM sistema 
    WHERE cliente_id = ${id}`);
  }
}

export default new SistemaDao();