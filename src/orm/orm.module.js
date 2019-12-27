import { Module, Dependencies } from '@nestjs/common';
import { OrmService } from './orm.service';
import { OrmController } from './orm.controller';
import { MySqlService } from '../my-sql/my-sql.service';

@Module({
  imports: [],
  providers: [OrmService],
  controllers: [OrmController]
})

@Dependencies(MySqlService)
export class OrmModule {
  constructor(mySqlService) {
    this.mySqlService = mySqlService;
  }
}
