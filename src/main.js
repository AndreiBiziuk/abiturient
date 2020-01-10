import dotenv from 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UriErrorFilter } from './orm/filter/uri-error.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  //app.useGlobalFilters(UriErrorFilter);
  await app.listen(3000);
}
bootstrap();
