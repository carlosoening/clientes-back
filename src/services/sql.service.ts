import Sql from '../models/sql.model.ts';
import sqlDao from '../dao/sql.dao.ts';
import EntidadeNaoEncontradaError from '../errors/entidadeNaoEncontradaError.ts';

class SqlService {

  async create(sql: Sql) {
    const value = await sqlDao.create(sql);   
    return value.rows[0].id;
  }
  
  async getById(id: number) {
    const value = await sqlDao.findById(id);
    let sql: Sql = new Sql();
    value.rows.map((v) => {
      sql = v;
    });
    if (!sql?.id) {
      throw new EntidadeNaoEncontradaError(`SQL não encontrado com o id: ${id}`);
    }
    return sql;
  }
  
  async getAll() {
    const value = await sqlDao.findAll();
    let sqls = new Array<Sql>();
    value.rows.map(v => {
      let sql: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        sql[el.name] = v[i];
      });
      sqls.push(sql);
    });
    return sqls;
  }
  
  async delete(id: number) {
    await sqlDao.delete(id);
  }
  
  async update(id: number, sql: Sql) {
    const latestSql = await this.getById(id);
  
    if (!latestSql?.id) {
      throw new EntidadeNaoEncontradaError(`SQL não encontrado com o id: ${id}`);
    }
  
    const updatedSql: Sql = {
      codigo: sql.codigo || latestSql.codigo,
      descricao: sql.descricao || latestSql.descricao,
      sql: sql.sql || latestSql.sql
    }
  
    await sqlDao.update(id, updatedSql);
  }

  async pesquisar(texto: string) {
    if (!texto) {
      return [];
    }
    const value = await sqlDao.pesquisar(texto);
    let sqls = new Array<Sql>();
    value.rows.map(v => {
      let sql: any = new Object();
      value.rowDescription?.columns.map((el, i) => {
        sql[el.name] = v[i];
      });
      sqls.push(sql);
    });
    return sqls;
  }
}

export default new SqlService();