import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PgConnectionService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('database.host'),
      port: this.config.get<number>('database.port'),
      database: this.config.get<string>('database.name'),
      username: this.config.get<string>('database.user'),
      password: this.config.get<string>('database.password'),
      autoLoadEntities: true,
      logging: true,
      synchronize: this.config.get<boolean>('database.synchronize'),
      ssl: {
        rejectUnauthorized: false, // For self-signed certificates
      },
      extra: {
        sslmode: 'require',
      },
    };
  }
}
