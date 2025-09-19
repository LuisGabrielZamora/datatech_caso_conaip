import { CustomBaseEntity } from "src/contexts/shared/infrastructure";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "src/contexts/projects/domain/entities/project.entity";
import { Employee } from "src/contexts/employees/domain/entities/employee.entity";
import { Task } from "src/contexts/tasks/domain/entities/task.entity";

@Entity('assignments')
export class Assignment extends CustomBaseEntity {
    @Column({ type: 'uuid' })
    projectId: string;

    @Column({ type: 'uuid' })
    employeeId: string;

    @Column({ type: 'date' })
    assignmentDate: Date;

    @Column({ type: 'uuid' })
    supervisorId: string;

    @Column({ type: 'uuid' })
    taskId: string;

    @ManyToOne(() => Project, { nullable: false })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @ManyToOne(() => Employee, { nullable: false })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @ManyToOne(() => Employee, { nullable: false })
    @JoinColumn({ name: 'supervisorId' })
    supervisor: Employee;

    @ManyToOne(() => Task, { nullable: false })
    @JoinColumn({ name: 'taskId' })
    task: Task;
}