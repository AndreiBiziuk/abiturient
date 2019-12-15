import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AbitursModule } from './abiturs/abiturs.module';

@Module({
  imports: [AbitursModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
