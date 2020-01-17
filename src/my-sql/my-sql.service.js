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
      typeCast: function (field, next) {
        if (field.type === 'DATETIME' ) {
          return field.string();
        } else {
          return next();
        }
      }
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

    if (result[0][0] && result[0][0]['COLUMN_NAME'] && result[0][0]['COLUMN_NAME'].length > 0){
      return result[0][0]['COLUMN_NAME']
    }else{
      const fields = await this.getFieldList(table);
      //console.log(fields);
      return fields[0];
    }
  }

  async getOneRow(table, key){

    const keyField = this.getKeyField(table);

    const sql = this.db.format(
      `SELECT * from ${table} where ?? = ?;`,
      [await keyField, key]
    );

    let result = await this.querySQL(sql);
    return result[0];
  }

  async getPage(table, page = 0, size = 10, sort = '1', filter = '') {
    const offset = page * size;
    const limit = size * 1;
    const order = sort
      .split(',')
      .filter(s => s != 0)
      .map(v => (v > 0 ? `${v * 1} ASC` : `${-v * 1} DESC`));

    let where = '';

    const fltr = filter && filter.split(';').map(f => f.split(','));

    if (fltr && fltr.length > 0) {
      where += 'WHERE ';

      let fieldList = await this.getFieldList(table);
      //console.log(fltr);
      where += fltr
        .map(f => `${fieldList[f[0] * 1 - 1]} LIKE ${this.db.escape('%' + this.escapeBadSymbols(f[1]) + '%')}`)
        .join(' AND ');
      where += ' ';
    }

    const orderString = order.length ? `order by ${order.join()} `:"";

    const sql = this.db.format(
      `SELECT * from ${table} ${where}${orderString}limit ? offset ?;`,
      [limit, offset],
    );

    //console.log(sql);

    let result = await this.querySQL(sql);
    return result[0];
  }

  escapeBadSymbols(str){
    let result = decodeURIComponent(Buffer.from(str, 'base64').toString());
    result = result.replace(/[%?\\]/g,'-');
    return result;
  }

  async getLinesCount(table, filter = '') {
    let where = '';

    const fltr = filter && filter.split(';').map(f => f.split(','));

    if (fltr && fltr.length > 0) {
      where += 'WHERE ';

      let fieldList = await this.getFieldList(table);
      //console.log(fltr);
      where += fltr
        .map(f => `${fieldList[f[0] * 1 - 1]} LIKE ${this.db.escape('%'+this.escapeBadSymbols(f[1])+'%')}`)
        .join(' AND ');
      where += ' ';
    }

    const sql = `SELECT count(*) as linescount from ${table} ${where};`;

    let response = await this.querySQL(sql);
    let result = 0;
    if (response[0] && response[0][0] && response[0][0]['linescount']){
      result = response[0][0];
    }

    return result;
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
