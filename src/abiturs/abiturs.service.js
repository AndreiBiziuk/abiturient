import { Injectable, Dependencies } from '@nestjs/common';
import { MySqlService } from '../my-sql/my-sql.service';

@Injectable()
@Dependencies(MySqlService)
export class AbitursService {
  constructor(mySqlService){
      this.db = mySqlService;
    }

    getAll(request){
        return `Hello abitur!`;        
    }

    async getOne(id){
        return this.db.querySQL("SELECT * from `tAbitur` where `idAbitur` = ?;", [id]);
    }

}
