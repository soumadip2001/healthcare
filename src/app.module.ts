import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountUserModule } from './account-user/account-user.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { DatabaseService } from './config/database.config';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from './appointment/appointment.module';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './common/auth.middleware';
import { AppointmentController } from './appointment/appointment.controller';
import { JwtAuthGuard } from './common/guard/auth.guard';
import { RolesGuard } from './common/guard/role.guard';

// Helper function to read key content safely

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccountUserModule,
    WebsocketsModule,
    DatabaseModule,
    AuthModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, JwtService,JwtAuthGuard, RolesGuard],
  exports: [JwtService,JwtAuthGuard, RolesGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
    .forRoutes(AppointmentController);
  }
}
