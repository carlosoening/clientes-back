class Cliente {

  constructor(
    public id?: number,
    public codigo?: string,
    public nome?: string,
    public email?: string,
    public febraban?: string,
    public telefone?: string,
    public tecnicoresponsavel?: string
  ) {}

  public static CODIGO_UNIQUE_CONSTRAINT_NAME: string = 'cliente_codigo_uk';
  
}

export default Cliente;