class TipoServidor {

  constructor(
    public id?: number,
    public codigo?: string,
    public nome?: string
  ) {}

  public static CODIGO_UNIQUE_CONSTRAINT_NAME: string = 'tiposervidor_codigo_uk';

}

export default TipoServidor;