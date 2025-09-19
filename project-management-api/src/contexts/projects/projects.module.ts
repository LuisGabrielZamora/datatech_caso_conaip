import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ProjectsController } from './infrastructure/controllers/projects.controller';
import { ProjectsService } from './infrastructure/services/projects.service';
import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { Project } from './domain/entities/project.entity';
import { ErrorHandlerService } from '../shared/infrastructure/services';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ErrorHandlerService, ProjectRepository],
  imports: [TypeOrmModule.forFeature([Project]), AuthModule],
  exports: [TypeOrmModule],
})
export class ProjectsModule {}