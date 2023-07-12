class Audit {

  constructor(
    public id?: number,
    public recurso?: string,
    public registro_id?: number,
    public datahora?: Date,
    public usuario?: string,
    public tipo?: string,
    public ip?: string
  ) {}

}

export default Audit;