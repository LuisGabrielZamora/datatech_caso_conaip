import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './contexts/auth/auth.module';
import configuration from './contexts/shared/domain/config';
import { SharedModule } from './contexts/shared/shared.module';
import { PgConnectionService } from './contexts/shared/infrastructure/services';
import { ClientsModule } from './contexts/clients/clients.module';
import { ProjectsModule } from './contexts/projects/projects.module';
import { EmployeesModule } from './contexts/employees/employees.module';
import { TasksModule } from './contexts/tasks/tasks.module';
import { AssignmentsModule } from './contexts/assignments/assignments.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: PgConnectionService }),
    EventEmitterModule.forRoot(),
    AuthModule,
    ClientsModule,
    ProjectsModule,
    EmployeesModule,
    TasksModule,
    AssignmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
