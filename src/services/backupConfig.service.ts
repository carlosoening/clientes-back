import BackupConfig from '../models/backupConfig.model.ts';
import backupConfigDao from '../dao/backupConfig.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class BackupConfigService {

  async create(backupConfig: BackupConfig) {
    const value = await backupConfigDao.create(backupConfig);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await backupConfigDao.findById(id);
    let backupConfig: BackupConfig = new BackupConfig();
    value.rows.map((v) => {
      backupConfig = v;
    });
    if (!backupConfig?.id) {
      throw new EntidadeNaoEncontradaError(`Config. de Backup não encontrado com o id: ${id}`);
    }
    return backupConfig;
  }

  async getByClienteId(id: number) {
    const value = await backupConfigDao.findByClienteId(id);
    let backupConfigs = new Array<BackupConfig>();
    value.rows.map(v => {
      let backupConfig: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        backupConfig[el.name] = v[i];
      });
      backupConfigs.push(backupConfig);
    });
    return backupConfigs;
  }
  
  async getAll() {
    const value = await backupConfigDao.findAll();
    let backupConfigs = new Array<BackupConfig>();
    value.rows.map(v => {
      let backupConfig: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        backupConfig[el.name] = v[i];
      });
      backupConfigs.push(backupConfig);
    });
    return backupConfigs;
  }
  
  async delete(id: number) {
    await backupConfigDao.delete(id);
  }
  
  async deleteByClienteId(id: number) {
    await backupConfigDao.deleteByClienteId(id);
  }

  async update(id: number, backupConfig: BackupConfig) {
    const latestBackupConfig = await this.getById(id);
  
    if (!latestBackupConfig?.id) {
      throw new EntidadeNaoEncontradaError(`Config. de Backup não encontrado com o id: ${id}`);
    }
  
    const updatedBackupConfig: BackupConfig = {
      descricao: backupConfig.descricao || latestBackupConfig.descricao,
      cliente_id: backupConfig.cliente_id || latestBackupConfig.cliente_id,
      usuariodb: backupConfig.usuariodb || latestBackupConfig.usuariodb,
      senhadb: backupConfig.senhadb || latestBackupConfig.senhadb,
      nomedb: backupConfig.nomedb || latestBackupConfig.nomedb,
      host: backupConfig.host || latestBackupConfig.host,
      port: backupConfig.port || latestBackupConfig.port,
      caminhobackup: backupConfig.caminhobackup || latestBackupConfig.caminhobackup,
      caminhojava: backupConfig.caminhojava || latestBackupConfig.caminhojava,
      caminhopgdump: backupConfig.caminhopgdump || latestBackupConfig.caminhopgdump,
      caminhosendhostjar: backupConfig.caminhosendhostjar || latestBackupConfig.caminhosendhostjar,
      horaexecucaobackup: backupConfig.horaexecucaobackup || latestBackupConfig.horaexecucaobackup,
      tiposervidor_id: backupConfig.tiposervidor_id || latestBackupConfig.tiposervidor_id,
      hostnamenuvem: backupConfig.hostnamenuvem || latestBackupConfig.hostnamenuvem,
      nomediretorionuvem: backupConfig.nomediretorionuvem || latestBackupConfig.nomediretorionuvem,
      qtdiasbackupnuvem: backupConfig.qtdiasbackupnuvem || latestBackupConfig.qtdiasbackupnuvem,
    }
  
    await backupConfigDao.update(id, updatedBackupConfig);
  }
}

export default new BackupConfigService()