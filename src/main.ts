import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

async function bootstrap() {
  try {
    // await connectDb
    const app = await NestFactory.create(AppModule);
    //for swagger setup
    const config = new DocumentBuilder()
      .setTitle('Healthcare Management API')
      .setDescription('APIs for managing patients, appointments, and analytics')
      .setVersion('1.0')
      .addBearerAuth() // enables JWT token field in Swagger UI
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // Swagger will be available at /api-docs

    app.use(
      morgan((tokens, req, res) => {
        return JSON.stringify({
          method: tokens.method(req, res),
          url: tokens.url(req, res),
          status: Number(tokens.status(req, res)),
          contentLength: tokens.res(req, res, 'content-length'),
          responseTime: Number(tokens['response-time'](req, res)),
          remoteAddr: tokens['remote-addr'](req, res),
          date: tokens.date(req, res, 'iso'),
        });
      }),
    );

    //validation for dto
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.listen(process.env.PORT ?? 3000);
  } catch (err) {
    Logger.log('Error from main.ts', err);
    throw err;
  }
}
bootstrap();
