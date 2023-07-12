import client from '../db/database.ts';
import BackupConfig from '../models/backupConfig.model.ts';

class BackupConfigDao {

  create(backupConfig: BackupConfig) {
    return client.queryObject<BackupConfig>(`INSERT INTO backupconfig 
      (descricao, cliente_id, usuariodb, senhadb, nomedb, host, port, 
        caminhobackup, caminhojava, caminhopgdump, caminhosendhostjar, 
        horaexecucaobackup, tiposervidor_id, hostnamenuvem, nomediretorionuvem, qtdiasbackupnuvem) 
      VALUES (
        ${backupConfig.descricao ? `'${backupConfig.descricao}'` : null},
        ${backupConfig.cliente_id || null},
        ${backupConfig.usuariodb ? `'${backupConfig.usuariodb}'` : null},
        ${backupConfig.senhadb ? `'${backupConfig.senhadb}'` : null},
        ${backupConfig.nomedb ? `'${backupConfig.nomedb}'` : null},
        ${backupConfig.host ? `'${backupConfig.host}'` : null},
        ${backupConfig.port || null},
        ${backupConfig.caminhobackup ? `'${backupConfig.caminhobackup}'` : null},
        ${backupConfig.caminhojava ? `'${backupConfig.caminhojava}'` : null},
        ${backupConfig.caminhopgdump ? `'${backupConfig.caminhopgdump}'` : null},
        ${backupConfig.caminhosendhostjar ? `'${backupConfig.caminhosendhostjar}'` : null},
        ${backupConfig.horaexecucaobackup ? `'${backupConfig.horaexecucaobackup}'` : null},
        ${backupConfig.tiposervidor_id || null},
        ${backupConfig.hostnamenuvem ? `'${backupConfig.hostnamenuvem}'` : null},
        ${backupConfig.nomediretorionuvem ? `'${backupConfig.nomediretorionuvem}'` : null},
        ${backupConfig.qtdiasbackupnuvem || null}
      ) RETURNING id`);
  }

  findById(id: number) {
    return client.queryObject<BackupConfig>(`SELECT * FROM backupconfig WHERE id = ${id}`);
  }
  
  findByClienteId(id: number) {
    return client.queryArray<BackupConfig[]>(`SELECT * FROM backupconfig WHERE cliente_id = ${id}  ORDER BY id`);
  }
  
  findAll() {
    return client.queryArray<BackupConfig[]>('SELECT * FROM backupconfig ORDER BY id');
  }

  delete(id: number) {
    return client.queryObject(`DELETE FROM backupconfig WHERE id = ${id}`);
  }

  deleteByClienteId(id: number) {
    return client.queryObject(`DELETE FROM backupconfig WHERE cliente_id = ${id}`);
  }

  update(id: number, backupConfig: BackupConfig) {
    let query = `UPDATE backupconfig SET 
    descricao = ${backupConfig.descricao ? `'${backupConfig.descricao}'` : null},
    cliente_id = ${backupConfig.cliente_id || null},
    usuariodb = ${backupConfig.usuariodb ? `'${backupConfig.usuariodb}'` : null},
    senhadb = ${backupConfig.senhadb ? `'${backupConfig.senhadb}'` : null},
    nomedb = ${backupConfig.nomedb ? `'${backupConfig.nomedb}'` : null},
    host = ${backupConfig.host ? `'${backupConfig.host}'` : null},
    port = ${backupConfig.port || null},
    caminhobackup = ${backupConfig.caminhobackup ? `'${backupConfig.caminhobackup}'` : null},
    caminhojava = ${backupConfig.caminhojava ? `'${backupConfig.caminhojava}'` : null},
    caminhopgdump = ${backupConfig.caminhopgdump ? `'${backupConfig.caminhopgdump}'` : null},
    caminhosendhostjar = ${backupConfig.caminhosendhostjar ? `'${backupConfig.caminhosendhostjar}'` : null},
    horaexecucaobackup = ${backupConfig.horaexecucaobackup ? `'${backupConfig.horaexecucaobackup}'` : null},
    tiposervidor_id = ${backupConfig.tiposervidor_id || null},
    hostnamenuvem = ${backupConfig.hostnamenuvem ? `'${backupConfig.hostnamenuvem}'` : null},
    nomediretorionuvem = ${backupConfig.nomediretorionuvem ? `'${backupConfig.nomediretorionuvem}'` : null},
    qtdiasbackupnuvem = ${backupConfig.qtdiasbackupnuvem || null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }
}

export default new BackupConfigDao();