import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';
import { META_ROLE } from '../decorators';
import { User } from '../../domain/entities';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRole: string[] = this.reflector.get(
      META_ROLE,
      context.getHandler(),
    );

    if (!validRole) return true;
    const req = context.switchToHttp().getRequest();

    const user = req.user as User;

    if (!user)
      throw new BadRequestException(CUSTOM_MESSAGES.notFoundUser.description);

    return validRole.includes(user.role);
  }
}
