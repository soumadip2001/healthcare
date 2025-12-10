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

    interface MorganToken {
      method: (req: any, res: any) => string;
      url: (req: any, res: any) => string;
      status: (req: any, res: any) => string;
      res: (req: any, res: any, header: string) => string;
      'response-time': (req: any, res: any) => string;
      'remote-addr': (req: any, res: any) => string;
      date: (req: any, res: any, format: string) => string;
    }

    interface LogEntry {
      method: string;
      url: string;
      status: number;
      contentLength: string | undefined;
      responseTime: number;
      remoteAddr: string;
      date: string;
    }

    app.use(
      morgan((tokens: MorganToken, req: any, res: any): string => {
        const logEntry: LogEntry = {
          method: tokens.method(req, res),
          url: tokens.url(req, res),
          status: Number(tokens.status(req, res)),
          contentLength: tokens.res(req, res, 'content-length'),
          responseTime: Number(tokens['response-time'](req, res)),
          remoteAddr: tokens['remote-addr'](req, res),
          date: tokens.date(req, res, 'iso'),
        };
        return JSON.stringify(logEntry);
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
bootstrap().catch((err) => {
  Logger.error('Error starting application', err);
  process.exit(1); // optional: exit with failure
});
