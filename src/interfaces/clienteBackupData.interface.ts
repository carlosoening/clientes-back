import Cliente from '../models/cliente.model.ts';

export default interface ClienteBackupData {
  cliente: Cliente;
  datasExistentes: string[];
  datasInexistentes: string[];
}