import Audit from '../model/audit.model.ts';
import auditDao from '../dao/audit.dao.ts';

class AuditService {

  async create(audit: Audit) {
    await auditDao.create(audit);
  }

}

export default new AuditService();