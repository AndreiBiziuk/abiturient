import { Module, Dependencies } from '@nestjs/common';
import { AbitursController } from './abiturs.controller';
import { AbitursService } from './abiturs.service';
import { MySqlService } from '../my-sql/my-sql.service';

@Module({
  imports: [],
  controllers: [AbitursController],
  providers: [AbitursService],
})
@Dependencies(MySqlService)
export class AbitursModule {
  constructor(mySqlService){
    this.mySqlService = mySqlService;
  }
}
