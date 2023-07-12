import client from '../db/database.ts';
import TokenUsuario from '../models/tokenUsuario.model.ts';

class TokenUsuarioDao {

  create(tokenUsuario: TokenUsuario) {
    return client.queryObject<TokenUsuario>(`INSERT INTO tokenusuario (token, usuario_id) 
      VALUES (
        ${tokenUsuario.token ? `'${tokenUsuario.token}'` : null}, 
        ${tokenUsuario.usuario_id ? `'${tokenUsuario.usuario_id}'` : null}
      )`);
  }

  findByUsuarioId(usuarioId: number) {
    return client.queryObject<TokenUsuario>(`SELECT * FROM tokenusuario WHERE usuario_id = ${usuarioId}`);
  }

  update(usuarioId: number, token: string) {
    let query = `UPDATE tokenusuario SET 
      token = ${token ? `'${token}'` : null}
    WHERE usuario_id = ${usuarioId}
    `;
    return client.queryObject<void>(query);
  }

  deleteByUsuarioId(usuarioId: number) {
    return client.queryObject(`DELETE FROM tokenusuario WHERE usuario_id = ${usuarioId}`);
  }

}

export default new TokenUsuarioDao();