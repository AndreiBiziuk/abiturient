import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AbitursModule } from './abiturs/abiturs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MySqlModule } from './my-sql/my-sql.module';
import { OrmModule } from './orm/orm.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [AbitursModule, AuthModule, UsersModule, MySqlModule, OrmModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
