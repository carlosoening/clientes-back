import auditService from '../service/audit.service.ts';
import Audit from '../model/audit.model.ts';
import { Request } from '../../deps.ts';
import { getPayloadFromToken } from '../../utils/jwt.ts';

export abstract class AuditController {

  protected recurso: string;
  
  constructor(
    recurso: string
  ) {
    this.recurso = recurso;
  }

  protected async auditChanges(request: Request, tipo: string, registroId?: number) {
    const headers = request.headers;
    const authorization = headers.get('Authorization');
    if (!authorization) {
      throw new Error('Token JWT inválido');
    }
    const jwt = authorization.split(' ')[1];
    const payload: any = getPayloadFromToken(jwt);

    const audit: Audit = {
      recurso: this.recurso,
      registro_id: registroId,
      usuario: payload.sub,
      tipo,
      ip: request.ip,
      datahora: new Date()
    }
    await auditService.create(audit);
  }

}