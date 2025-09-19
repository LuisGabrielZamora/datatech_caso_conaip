import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { IUser } from '../../domain/abstractions';

const tokenKey = 'token.secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>(tokenKey);
    if (!secret) {
      throw new Error(
        `JWT secret not set in configuration for key: ${tokenKey}`,
      );
    }
    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IUser): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new UnauthorizedException(
        CUSTOM_MESSAGES.currentTokenInvalid.description,
      );

    if (!user.recordStatus)
      throw new UnauthorizedException(CUSTOM_MESSAGES.inactiveUser.description);

    return user;
  }
}
