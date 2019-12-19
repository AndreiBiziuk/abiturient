import { Module, Global } from '@nestjs/common';
import { MySqlService } from './my-sql.service';

@Global()
@Module({
  providers: [MySqlService],
  exports: [MySqlService],
})
export class MySqlModule {}
