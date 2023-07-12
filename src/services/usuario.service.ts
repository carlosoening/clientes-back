import usuarioDao from '../dao/usuario.dao.ts';
import { hashSync } from '../deps.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';
import Usuario from '../models/usuario.model.ts';

class UsuarioService {
  
  async create(usuario: Usuario) {
    const value = await usuarioDao.create(usuario);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await usuarioDao.findById(id);
    let usuario: Usuario = new Usuario();
    value.rows.map((v) => {
      usuario = v;
    });
    if (!usuario?.id) {
      throw new EntidadeNaoEncontradaError(`Usuário não encontrado com o id: ${id}`);
    }
    return usuario;
  }
  
  async getByCodigo(codigo: string) {
    const value = await usuarioDao.findByCodigo(codigo);
    let usuario: Usuario = new Usuario();
    value.rows.map((v) => {
      usuario = v;
    });
    if (!usuario?.id) {
      throw new EntidadeNaoEncontradaError(`Usuário não encontrado com o código: ${codigo}`);
    }
    return usuario;
  }

  async getByEmail(email: string) {
    const value = await usuarioDao.findByEmail(email);
    let usuario: Usuario = new Usuario();
    value.rows.map((v) => {
      usuario = v;
    });
    if (!usuario?.id) {
      throw new EntidadeNaoEncontradaError(`Usuário não encontrado com o e-mail: ${email}`);
    }
    return usuario;
  }
  
  async getAll() {
    const value = await usuarioDao.findAll();
    let usuarios = new Array<Usuario>();
    value.rows.map(v => {
      let usuario: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        usuario[el.name] = v[i];
      });
      usuarios.push(usuario);
    });
    return usuarios;
  }
  
  async delete(id: number) {
    await usuarioDao.delete(id);
  }
  
  async update(id: number, usuario: Usuario) {
    const latestUsuario = await this.getById(id);
  
    if (!latestUsuario?.id) {
      throw new EntidadeNaoEncontradaError(`Usuário não encontrado com o id: ${id}`);
    }
  
    const updatedUsuario: Usuario = {
      codigo: usuario.codigo || latestUsuario.codigo,
      nome: usuario.nome || latestUsuario.nome,
      email: usuario.email || latestUsuario.email,
      senha: latestUsuario.senha,
      ativo: usuario.ativo ?? latestUsuario.ativo,
      tipo: usuario.tipo || latestUsuario.tipo,
      ip_maquina: usuario.ip_maquina || latestUsuario.ip_maquina
    }
  
    await usuarioDao.update(id, updatedUsuario);
  }

  async alterarSenha(codigoUsuario: string, novaSenha: string) {
    const value = await usuarioDao.findByCodigo(codigoUsuario);
    let usuario: Usuario = new Usuario();
    value.rows.map((v) => {
      usuario = v;
    });
    const novaSenhaEncriptada = hashSync(novaSenha);
    const updatedUsuario: Usuario = {
      codigo: usuario.codigo,
      nome: usuario.nome,
      email: usuario.email,
      senha: novaSenhaEncriptada,
      ativo: usuario.ativo,
      tipo: usuario.tipo,
      ip_maquina: usuario.ip_maquina
    }
    await usuarioDao.update(Number(usuario.id), updatedUsuario);
  }

  async pesquisar(texto: string) {
    if (!texto) {
      return [];
    }
    const value = await usuarioDao.pesquisar(texto);
    let usuarios = new Array<Usuario>();
    value.rows.map(v => {
      let usuario: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        usuario[el.name] = v[i];
      });
      usuarios.push(usuario);
    });
    return usuarios;
  }
}

export default new UsuarioService();