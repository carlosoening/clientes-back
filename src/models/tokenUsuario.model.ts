class TokenUsuario {

  constructor(
    public token?: string,
    public usuario_id?: number
  ) {}

  public static USUARIO_ID_UNIQUE_CONSTRAINT_NAME: string = 'tokenusuario_usuario_id_uk';
  
}

export default TokenUsuario;