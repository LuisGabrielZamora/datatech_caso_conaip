import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { TasksController } from './infrastructure/controllers/tasks.controller';
import { TasksService } from './infrastructure/services/tasks.service';
import { TaskRepository } from './infrastructure/repositories/task.repository';
import { Task } from './domain/entities/task.entity';
import { ErrorHandlerService } from '../shared/infrastructure/services';

@Module({
  controllers: [TasksController],
  providers: [TasksService, ErrorHandlerService, TaskRepository],
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  exports: [TypeOrmModule],
})
export class TasksModule {}
