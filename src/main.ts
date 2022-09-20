import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['akc78wKasjd&dhc!24']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),6a
  );
  await app.listen(3000);
}
bootstrap();
