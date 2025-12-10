import { Module } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { AccountUserRepository } from './account-user.repository';
import { AccountUserController } from './accout-user.controller';
import { User, UserSchema } from './schema/account-user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RoleSchema } from 'src/common/schema/roles.schema';
import { JwtService } from '@nestjs/jwt';
// import { JwtService } from '@nestjs/jwt';
// import { JwtService } from 'src/common/auth.service';
// import { AuthModule } from 'src/common/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Roles.name, schema: RoleSchema },
    ]),
  //  JwtService,
  ],
  controllers: [AccountUserController],
  providers: [AccountUserService, AccountUserRepository, JwtService],
  exports: [AccountUserRepository]
})
export class AccountUserModule {}
