import { Injectable, Dependencies } from '@nestjs/common';
import { MySqlService } from '../my-sql/my-sql.service';

@Injectable()
@Dependencies(MySqlService)
export class AbitursService {
  constructor(mySqlService) {
    this.db = mySqlService;
  }

  getAll(request) {
    return `Hello abitur!`;
  }

  async getOne(id) {
    let result =  await this.db.querySQL('SELECT * from `tAbitur` where `idAbitur` = ?;', [
      id,
    ]);
    return result[0][0];
  }

  async getPage(params, req) {
    return this.db.getPage(
      '(select idAbitur, Фамилия from tAbitur) as q1',
      params.page,
      params.size,
      params.sort,
      params.filter,
    );
  }

  async getPageWihtoutFilter(params, req) {
    //console.log('abiturs/page ', params, req.query);
    return this.db.getPage(
      '(select idAbitur, Фамилия from tAbitur) as q1',
      params.page,
      params.size,
      params.sort,
    );
  }
}
