class Sql {

  constructor(
    public id?: number,
    public codigo?: string,
    public descricao?: string,
    public sql?: string
  ) {}

  public static CODIGO_UNIQUE_CONSTRAINT_NAME: string = 'sql_codigo_uk';
  
}

export default Sql;