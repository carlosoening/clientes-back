class BackupConfig {

  constructor(
    public id?: number,
    public descricao?: string,
    public cliente_id?: number,
    public usuariodb?: string,
    public senhadb?: string,
    public nomedb?: string,
    public host?: string,
    public port?: number,
    public caminhobackup?: string,
    public caminhojava?: string,
    public caminhopgdump?: string,
    public caminhosendhostjar?: string,
    public horaexecucaobackup?: string,
    public tiposervidor_id?: number,
    public hostnamenuvem?: string,
    public nomediretorionuvem?: string,
    public qtdiasbackupnuvem?: number,
  ) {}

}

export default BackupConfig;