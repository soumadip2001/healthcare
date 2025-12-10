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
    // find user with email
    const isUserExists: IUser | null =
      await this.accountUserRepository.findUserWithEmail(body.email);

    if (isUserExists) {
      throw new HttpException('User Already exists', 422);
    }

    // get default role
    const defaultRoles = await this.accountUserRepository.getdefaultRoles();

    const roleId: string | null =
      defaultRoles.length > 0 &&
      typeof defaultRoles[0]._id?.toString === 'function'
        ? defaultRoles[0]._id.toString()
        : null;

    // create user
    const user = await this.accountUserRepository.adduser(body, roleId);
    Logger.log(`user added -- ${JSON.stringify(user)}`);

    // fetch created user
    const userInfo = await this.accountUserRepository.findUserWithEmail(
      body.email,
    );

    if (!userInfo) {
      throw new HttpException('User creation failed', 500);
    }

    // remove password safely
    const { password, ...userWithoutPassword } = userInfo;
    console.log(password);

    return userWithoutPassword;
  }

  async handleLogin(body: Ilogin) {
    // find userwith email is exists in users table if exists then throw err with status code
    const isuserExists: any =
      await this.accountUserRepository.findUserWithEmail(body.email);
    Logger.log(isuserExists);
    if (!isuserExists) throw new HttpException('User not found', 404);
    // check password using bcrypt
    if (body.password != isuserExists?.password)
      throw new HttpException('unauthorized', 401);
    const { password, ...userwithpassword } = isuserExists;
    console.log(password);

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
  }
}
