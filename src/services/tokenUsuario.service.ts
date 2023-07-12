import TokenUsuario from '../models/tokenUsuario.model.ts';
import tokenUsuarioDao from '../dao/tokenUsuario.dao.ts';

class TokenUsuarioService {

  async getByUsuarioId(usuarioId: number) {
    const value = await tokenUsuarioDao.findByUsuarioId(usuarioId);
    let tokenUsuario: TokenUsuario = new TokenUsuario();
    value.rows.map((v) => {
      tokenUsuario = v;
    });
    if (!tokenUsuario?.usuario_id) {
      return null;
    }
    return tokenUsuario;
  }

  async update(usuarioId: number, token: string) {
    const latestTokenUsuario = await this.getByUsuarioId(usuarioId);
  
    if (!latestTokenUsuario) {
      const newTokenUsuario: TokenUsuario = {
        token,
        usuario_id: usuarioId
      }
      await tokenUsuarioDao.create(newTokenUsuario);
      return;
    }
  
    await tokenUsuarioDao.update(usuarioId, token);
  }

  async deleteByUsuarioId(usuarioId: number) {
    await tokenUsuarioDao.deleteByUsuarioId(usuarioId);
  }

}

export default new TokenUsuarioService();