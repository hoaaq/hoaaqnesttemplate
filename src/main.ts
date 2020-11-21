import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serviceport } from '@const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(serviceport);
}
bootstrap();
