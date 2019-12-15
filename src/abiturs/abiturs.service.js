import { Injectable } from '@nestjs/common';
import * as mysql2 from 'mysql2';

function censor(censor) {
  var i = 0;

  return function(key, value) {
    if (
      i !== 0 &&
      typeof censor === 'object' &&
      typeof value == 'object' &&
      censor == value
    )
      return '[Circular]';

    if (i >= 29)
      // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;
  };
}

@Injectable()
export class AbitursService {
    constructor(){
        const pool = mysql2.createPool({
          connectionLimit: 5,
          host: 'localhost',
          user: 'abitur',
          database: 'dbAbitur2020',
          password: 'abitur',
        });

        this.db = pool;
    }

    getAll(request){
        return `Hello abitur! \n <pre> ${JSON.stringify(request, censor(request))} </pre>`;        
    }

    async getOne(id){
        return new Promise((resolve,reject)=>{
            this.db.query(
            "SELECT * from `tAbitur` where `idAbitur` = ?;",
            [id],
            (err, data, fields)=>{
                return err ? reject(err) : resolve(data[0]);
            },
            )
        });
    }

    async querySQL(sql){
        return new Promise((resolve, reject) => {
          this.db.query(sql, (err, data, fields) => {
            return err ? reject(err + sql) : resolve([data, fields.map(f=>f.name)]);
          });
        });
    }

    async getFieldList(table){
        const sql = `SELECT * FROM ${table} limit 0`;

        let result = await this.querySQL(sql);

        //console.log(result[1]);
        return result[1];
    }

    async getPage(table, page = 0, size = 10, sort = 1, filter = ''){
        const offset = page * size;
        const limit = size * 1;
        const order = sort.split(',').map((v)=>v>0?`${v*1} ASC`:`${-v*1} DESC`);
        
        let where = "";

        const fltr = filter && filter.split(';').map(f => f.split(','));

        if(fltr && fltr.length > 0){
            where += "WHERE ";

            let fieldList = await this.getFieldList(table);
            console.log(fltr);
            where += fltr.map((f)=>`${fieldList[f[0]*1-1]} LIKE '%${f[1]}%'`).join(' AND ');
            where += " ";
        }

        const sql = this.db.format(
          `SELECT * from ${table} ${where}order by ${order.join()} limit ? offset ?;`,
          [limit, offset],
        );

        let result = await this.querySQL(sql);
        return result[0];
    }

}
