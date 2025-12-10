import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Bearer header
      ignoreExpiration: false,
      secretOrKey: 'your_secret_key', // Keep in env
    });
  }

  validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
