import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authentication failed');
    }
    next();
  }
}
