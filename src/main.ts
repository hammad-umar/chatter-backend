import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  app.useLogger(app.get(Logger));

  await app.listen(port);
};

bootstrap();
