import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { User } from '../../domain/entities';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  if (!user)
    throw new InternalServerErrorException(
      CUSTOM_MESSAGES.missingToken.description,
    );
  return data ? user[data] : (user as User);
});
