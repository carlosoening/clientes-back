class Usuario {

  constructor(
    public id?: number,
    public codigo?: string,
    public email?: string,
    public nome?: string,
    public senha?: string,
    public ativo?: boolean,
    public tipo?: string,
    public ip_maquina?: string
  ) {}

  public static CODIGO_UNIQUE_CONSTRAINT_NAME: string = 'usuario_codigo_uk';
  public static EMAIL_UNIQUE_CONSTRAINT_NAME: string = 'usuario_email_uk';
  
}

export default Usuario;