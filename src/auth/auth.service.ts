import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Mock user login for demo
  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = { id: 1, username: 'test', password: await bcrypt.hash('1234', 10) }; 
  //   const isMatch = await bcrypt.compare(pass, user.password);
  //   if (user && isMatch) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
