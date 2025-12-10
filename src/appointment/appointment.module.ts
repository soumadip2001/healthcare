import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './schema/appointment.schema';
import { AccountUserModule } from 'src/account-user/account-user.module';
import { AccountUserRepository } from 'src/account-user/account-user.repository';
import { AppointmentRepository } from './appointment.repository';
import { User, UserSchema } from 'src/account-user/schema/account-user.schema';
import { Roles, RoleSchema } from 'src/common/schema/roles.schema';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guard/role.guard';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { WebsocketsGateway } from 'src/websockets/websockets.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
      { name: Roles.name, schema: RoleSchema },
    ]),
    AccountUserModule,
    WebsocketsModule,
  ],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    AppointmentRepository,
    AccountUserRepository,
    JwtAuthGuard,
    JwtService,
    RolesGuard,
    WebsocketsGateway
  ],
})
export class AppointmentModule {}
