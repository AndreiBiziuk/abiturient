import { Module } from '@nestjs/common';
import { AbitursController } from './abiturs.controller';
import { AbitursService } from './abiturs.service';

@Module({
  imports: [],
  controllers: [AbitursController],
  providers: [AbitursService],
})
export class AbitursModule {}
