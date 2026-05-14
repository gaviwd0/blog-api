import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transformRequest.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exeption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('blogapi/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );

  // Interceptor - transforma todas las respuestas exitosas
  app.useGlobalInterceptors(new TransformInterceptor());

  // Filter - estandariza todos los errores HTTP
  app.useGlobalFilters(new HttpExceptionFilter());

  // mantener esto a lo ultimo siempre
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
