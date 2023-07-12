class Conexao {

  constructor(
    public id?: number,
    public tipoconexao_id?: number,
    public ip?: string,
    public usuario?: string,
    public senha?: string,
    public cliente_id?: number
  ) {}

}

export default Conexao;