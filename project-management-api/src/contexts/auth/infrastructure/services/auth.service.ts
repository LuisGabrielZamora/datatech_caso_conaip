import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SecurityService } from './security.service';
import { User } from '../../domain/entities';
import { AuthRepository } from '../repositories';
import { LoginDto } from '../../domain/dto';
import { UserResources } from '../../domain/enum';
import { IUser } from '../../domain/abstractions';
import { UserSeed } from '../../domain/seeds/seed';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';

const bearerTokenKey = 'Bearer ';

@Injectable()
export class AuthService {
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  @Inject(SecurityService)
  private readonly securityService: SecurityService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor(private readonly repository: AuthRepository) {}

  async validateToken(token: string): Promise<User | null> {
    const tokenVerifiedResponse = this.jwtService.verify(
      token.replace(bearerTokenKey, ''),
    );
    if (tokenVerifiedResponse.hasOwnProperty('id')) {
      return await this.repository.findOne(tokenVerifiedResponse.id);
    }

    throw new UnauthorizedException(
      CUSTOM_MESSAGES.currentTokenInvalid.description,
    );
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.repository.getInstance().findOne({
      where: { email },
      relations: UserResources.ENTITY_RELATIONS,
    });

    if (!user)
      throw new UnauthorizedException(CUSTOM_MESSAGES.notFound.description);

    if (!this.securityService.validatePassword(password, user.password))
      throw new UnauthorizedException(
        CUSTOM_MESSAGES.wrongPassword.description,
      );

    try {
      return {
        user,
        token: this.getJwtToken({ ...user }),
      };
    } catch (e) {
      this.errorHandlerService.handleDatabaseErrors(
        e,
        CUSTOM_MESSAGES.wrongPassword.description,
      );
    }
  }

  async seed() {
    try {
      return await this.repository.seed(UserSeed);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.onCreateError.description,
      );
    }
  }

  getJwtToken(payload: IUser) {
    return this.jwtService.sign(payload);
  }
}
