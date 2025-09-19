import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers';
import { SecurityService } from './infrastructure/services/security.service';
import { AuthService } from './infrastructure/services/auth.service';
import { AuthRepository } from './infrastructure/repositories';
import { SharedModule } from '../shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthVars } from './domain/enum';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { User } from './domain/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ErrorHandlerService } from '../shared/infrastructure/services';

export const CustomPassportModule = PassportModule.register({
  defaultStrategy: AuthVars.authStrategy,
});

@Module({
  controllers: [AuthController],
  providers: [AuthService, SecurityService, AuthRepository, JwtStrategy, ErrorHandlerService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    CustomPassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(AuthVars.tokenSecret),
        signOptions: {
          expiresIn: configService.get<string>(AuthVars.tokenExpiresIn),
        },
      }),
    }),
    SharedModule,
  ],
  exports: [TypeOrmModule, JwtStrategy, CustomPassportModule, JwtModule],
})
export class AuthModule {}
