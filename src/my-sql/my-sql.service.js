import { Injectable } from '@nestjs/common';
import * as mysql2 from 'mysql2';

@Injectable()
export class MySqlService {
  constructor() {

    const pool = mysql2.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DBNAME,
      password: process.env.DB_PASS,
    });

    this.db = pool;
  }

  async querySQL(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (err, data, fields) => {
        return err
          ? reject(err + '\n' + sql)
          : resolve([data, fields?fields.map(f => f.name):[]]);
      });
    });
  }

  async getFieldList(table) {
    const sql = `SELECT * FROM ${table} limit 0`;

    let result = await this.querySQL(sql);

    //console.log(result[1]);
    return result[1];
  }

  async getKeyField(table) {
    let sql = this.db.format(
      `SELECT COLUMN_NAME FROM information_schema.columns
      where TABLE_SCHEMA = ?
      and TABLE_NAME = ?
      and COLUMN_KEY = 'PRI'`,
      [process.env.DB_DBNAME, table]
    );

    const result = await this.querySQL(sql);
    return result[0][0]['COLUMN_NAME'];
  }

  async getPage(table, page = 0, size = 10, sort = '1', filter = '') {
    const offset = page * size;
    const limit = size * 1;
    const order = sort
      .split(',')
      .map(v => (v > 0 ? `${v * 1} ASC` : `${-v * 1} DESC`));

    let where = '';

    const fltr = filter && filter.split(';').map(f => f.split(','));

    if (fltr && fltr.length > 0) {
      where += 'WHERE ';

      let fieldList = await this.getFieldList(table);
      console.log(fltr);
      where += fltr
        .map(f => `${fieldList[f[0] * 1 - 1]} LIKE '%${f[1]}%'`)
        .join(' AND ');
      where += ' ';
    }

    const sql = this.db.format(
      `SELECT * from ${table} ${where}order by ${order.join()} limit ? offset ?;`,
      [limit, offset],
    );

    let result = await this.querySQL(sql);
    return result[0];
  }

  async updateValues(table, keyValue, names=[], values=[]){
    
    const keyField = await this.getKeyField(table);

    let sqlSet = {};
    sqlSet[keyField] = keyValue;

    names.forEach((name, index) => {
      sqlSet[name] = values[index];
    });
    
    const sql = "UPDATE ?? SET ? WHERE ?? = ?;";

    let result = await this.querySQL(sql, [table, sqlSet, keyField, keyValue]);
    return result[0];
  }

  async insertValues(table, names=[], values=[]){

    let sqlSet = {};

    names.forEach((name, index) => {
      sqlSet[name] = values[index];
    });

    const sql = "INSERT INTO ?? SET ?;";
    let result = await this.querySQL(sql, [table, sqlSet]);
    return result[0].insertId;
  }

  async deleteValues(table, keyValue){
    const keyField = await this.getKeyField(table);

    const sql = "DELETE FROM ?? WHERE ?? = ?;";
    let result = await this.querySQL(sql, [table, keyField, keyValue]);
    return result[0];
  }
}
