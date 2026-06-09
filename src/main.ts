import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transformRequest.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exeption.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const swagerUrl: string =
  (process.env.API_URL ?? 'http://localhost:3000/') +
  (process.env.API_PREFIX ?? 'blogapi/v1');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'blogapi/v1');

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

  //config swagger
  const config = new DocumentBuilder()
    .addServer(swagerUrl)
    .setTitle('Blog Api - NestJs')
    .setDescription(
      'RESTful API para un sistema de blog con autenticación JWT, roles de usuario, y CRUD completo de posts, comentarios y tags',
    )
    .setVersion('1.0')
    .addTag('Blogs')
    .addTag(
      'Auth',
      'Endpoints de autenticación: registro, login, refresh y logout',
    )
    .addTag(
      'Posts',
      'CRUD de posts con paginación, filtros y control de visibilidad',
    )
    .addTag('Users', 'Gestión de usuarios con roles y ownership')
    .addTag('Comments', 'Comentarios asociados a posts')
    .addTag('Tags', 'Etiquetas con soft-delete para categorizar posts')
    .addTag(
      'Health Check',
      'Endpoint de salud de la API, sirve para verificar el estado de la API',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // <--- este es el "key" del security scheme, importante
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory);

  // mantener esto a lo ultimo siempre
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
