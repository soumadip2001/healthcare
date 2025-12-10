import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AccountUserRepository } from './account-user.repository';
import { Ilogin, IUser } from './interface/account-user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountUserService {
  constructor(
    private readonly accountUserRepository: AccountUserRepository,
    private jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async handleRegister(body: IUser) {
    try {
      // find userwith email is exists in users table if exists then throw err with status code
      const isuserExists = await this.accountUserRepository.findUserWithEmail(
        body.email,
      );
      // Logger.log(isuserExists);
      // if not exists then send an entry
      if (isuserExists) throw new HttpException('User Already exists', 422);

      const defaultrole = await this.accountUserRepository.getdefaultRoles();
      const roleid =
        defaultrole.length > 0 ? defaultrole[0]._id.toString() : null;
      const user = await this.accountUserRepository.adduser(body, roleid);
      const userInfo = await this.accountUserRepository.findUserWithEmail(
        body.email,
      );
      const { password, ...userWithoutPassword }: any = userInfo;
      return userWithoutPassword;
    } catch (err) {
      throw err;
    }
  }

  async handleLogin(body: Ilogin) {
    try {
      // find userwith email is exists in users table if exists then throw err with status code
      const isuserExists: any =
        await this.accountUserRepository.findUserWithEmail(body.email);
      Logger.log(isuserExists);
      if (!isuserExists) throw new HttpException('User not found', 404);
      // check password using bcrypt
      if (body.password != isuserExists?.password)
        throw new HttpException('unauthorized', 401);
      const { password, ...userwithpassword } = isuserExists;
      const roleInfo = await this.accountUserRepository.findByRoleid(
        isuserExists.roleId,
      );
      const payload = {
        sub: isuserExists._id,
        email: isuserExists.email,
        rolename: roleInfo?.name,
      };
      //generate authtoken
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });
      return { user: userwithpassword, access_token: token };
    } catch (err) {
      throw err;
    }
  }
}
