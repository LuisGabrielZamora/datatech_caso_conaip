import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { AssignmentsController } from './infrastructure/controllers/assignments.controller';
import { AssignmentsService } from './infrastructure/services/assignments.service';
import { AssignmentRepository } from './infrastructure/repositories/assignment.repository';
import { Assignment } from './domain/entities/assignment.entity';
import { ErrorHandlerService } from '../shared/infrastructure/services';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService, ErrorHandlerService, AssignmentRepository],
  imports: [TypeOrmModule.forFeature([Assignment]), AuthModule],
  exports: [TypeOrmModule],
})
export class AssignmentsModule {}
