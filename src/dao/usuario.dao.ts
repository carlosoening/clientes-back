import client from '../db/database.ts';
import Usuario from '../models/usuario.model.ts';

class UsuarioDao {

  create(usuario: Usuario) {
    return client.queryObject<Usuario>(`INSERT INTO usuario (codigo, email, nome, senha, ativo, tipo, ip_maquina) 
      VALUES (
        ${usuario.codigo ? `'${usuario.codigo}'` : null}, 
        ${usuario.email ? `'${usuario.email}'` : null}, 
        ${usuario.nome ? `'${usuario.nome}'` : null}, 
        ${usuario.senha ? `'${usuario.senha}'` : null}, 
        ${usuario.ativo}, 
        ${usuario.tipo ? `'${usuario.tipo}'` : null},
        ${usuario.ip_maquina ? `'${usuario.ip_maquina}'` : null}
      ) RETURNING id`);
  }
  
  findById(id: number) {
    return client.queryObject<Usuario>(`SELECT * FROM usuario WHERE id = ${id}`);
  }

  findByCodigo(codigo: string) {
    return client.queryObject<Usuario>(`SELECT * FROM usuario WHERE codigo = '${codigo}'`);
  }

  findByEmail(email: string) {
    return client.queryObject<Usuario>(`SELECT * FROM usuario WHERE email = '${email}'`);
  }

  findAll() {
    return client.queryArray<Usuario[]>('SELECT id, codigo, email, nome, ativo, tipo, ip_maquina FROM usuario');
  }

  delete(id: number) {
    return client.queryObject<void>(`DELETE FROM usuario WHERE id = ${id}`);
  }

  update(id: number, usuario: Usuario) {
    let query = `UPDATE usuario SET 
      codigo = ${usuario.codigo ? `'${usuario.codigo}'` : null}, 
      email = ${usuario.email ? `'${usuario.email}'` : null}, 
      nome = ${usuario.nome ? `'${usuario.nome}'` : null}, 
      senha = ${usuario.senha ? `'${usuario.senha}'` : null}, 
      ativo = ${usuario.ativo}, 
      tipo = ${usuario.tipo ? `'${usuario.tipo}'` : null},
      ip_maquina = ${usuario.ip_maquina ? `'${usuario.ip_maquina}'` : null}
    WHERE id = ${id}
    `;
    return client.queryObject<void>(query);
  }

  pesquisar(texto: string) {
    return client.queryArray(`SELECT * FROM usuario 
      WHERE codigo ILIKE '%${texto}%' 
      OR email ILIKE '%${texto}%' 
      OR nome ILIKE '%${texto}%'`);
  }
}

export default new UsuarioDao();