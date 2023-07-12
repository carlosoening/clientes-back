import client from '../../db/database.ts';
import Audit from '../model/audit.model.ts';
import { formatDateToTimestamp } from '../../utils/date.ts';

class AuditDao {

  create(audit: Audit) {
    return client.queryObject<Audit>(`INSERT INTO audit.revinfo (recurso, registro_id, tipo, usuario, ip, datahora) 
      VALUES (
        ${audit.recurso ? `'${audit.recurso}'` : null}, 
        ${audit.registro_id || null},
        ${audit.tipo ? `'${audit.tipo}'` : null}, 
        ${audit.usuario ? `'${audit.usuario}'` : null},
        ${audit.ip ? `'${audit.ip}'` : null},
        ${audit.datahora ? `'${formatDateToTimestamp(audit.datahora)}'` : null}
      )`);
  }
}

export default new AuditDao();