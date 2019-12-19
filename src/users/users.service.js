import { Injectable, Dependencies } from '@nestjs/common';
import { MySqlService } from '../my-sql/my-sql.service';

@Injectable()
@Dependencies(MySqlService)
export class UsersService {
  constructor(mySqlService) {
    this.db = mySqlService;
  }

  async findOne(username) {
    let sql = "SELECT * from tUsers where login = ?";
    let users = await this.db.querySQL(sql, [username]);
    if(users && users.length){
      return {...users[0][0]};
    }else{
      return {};
    }
  }

  async getAll(user){
    if(user.privilege < 99) return [];

    return this.db.getPage('tUsers', 0, 999);
  }
}
