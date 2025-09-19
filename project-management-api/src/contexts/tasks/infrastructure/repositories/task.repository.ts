import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { IPaginatorDto } from "src/contexts/shared/domain/abstractions";
import { PaginatorUtil } from "src/contexts/shared/application";

import { TaskResources } from "../../domain/enum";
import { Task } from "../../domain/entities/task.entity";
import { GenericRepository } from "src/contexts/shared/application";
import { ITask } from "../../domain/abstractions/task.interface";
import { CUSTOM_MESSAGES } from "src/contexts/shared/domain/constants";
import { ErrorHandlerService } from "src/contexts/shared/infrastructure/services";

@Injectable()
export class TaskRepository extends GenericRepository<Task> {
    @Inject(ErrorHandlerService)
    protected readonly errorHandlerService: ErrorHandlerService;

    constructor(
        @InjectRepository(Task)
        _repository: Repository<Task>,
    ) {
        super(_repository, TaskResources.UNIQUE_CONSTANTS);
    }

    async seed(
        records: ITask[],
    ) {
        try {
            const httpResponses = records.map(seed => this.createEntity(seed));
            return await Promise.allSettled(httpResponses);
        } catch (error) {
            this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.onCreateError.description);
        }
    }

    async findByProjectId(projectId: string, page: number = 0, limit: number = 10) {
        try {
            return await this.getEntities(page, limit, {
                where: { projectId },
                relations: TaskResources.ENTITY_RELATIONS,
            });
        } catch (error) {
            this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
        }
    }

    async findByAssigneeId(assigneeEmployeeId: string, page: number = 0, limit: number = 10) {
        try {
            return await this.getEntities(page, limit, {
                where: { assigneeEmployeeId },
                relations: TaskResources.ENTITY_RELATIONS,
            });
        } catch (error) {
            this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
        }
    }

    async findBySupervisorId(supervisorId: string, page: number = 0, limit: number = 10) {
        try {
            return await this.getEntities(page, limit, {
                where: { supervisorId },
                relations: TaskResources.ENTITY_RELATIONS,
            });
        } catch (error) {
            this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
        }
    }
}