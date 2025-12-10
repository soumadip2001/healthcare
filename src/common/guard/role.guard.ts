import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Rolename } from 'src/config/enum.config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Rolename, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // No roles required, allow access

    const request: any = context.switchToHttp().getRequest();
    const user = request?.user;

    if (!user) return false;

    if (!requiredRoles.includes(user?.rolename)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
