import { CustomBaseEntity } from "src/contexts/shared/infrastructure";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "src/contexts/projects/domain/entities/project.entity";
import { Employee } from "src/contexts/employees/domain/entities/employee.entity";

@Entity('tasks')
export class Task extends CustomBaseEntity {
    @Column({ type: 'uuid' })
    projectId: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate?: Date;

    @Column({ type: 'uuid' })
    assigneeEmployeeId: string;

    @Column({ type: 'uuid' })
    supervisorId: string;

    @ManyToOne(() => Project, { nullable: false })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @ManyToOne(() => Employee, { nullable: false })
    @JoinColumn({ name: 'assigneeEmployeeId' })
    assignee: Employee;

    @ManyToOne(() => Employee, { nullable: false })
    @JoinColumn({ name: 'supervisorId' })
    supervisor: Employee;
}