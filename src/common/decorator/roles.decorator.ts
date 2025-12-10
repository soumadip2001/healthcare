// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Rolename } from 'src/config/enum.config';

export const Roles = (...roles: string[]) => SetMetadata(Rolename, roles);
