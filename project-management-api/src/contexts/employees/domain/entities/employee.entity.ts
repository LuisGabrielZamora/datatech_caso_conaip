import { CustomBaseEntity } from "src/contexts/shared/infrastructure";
import { Column, Entity } from "typeorm";

@Entity('employees')
export class Employee extends CustomBaseEntity {
    @Column({ type: 'varchar', length: 150 })
    firstName: string;

    @Column({ type: 'varchar', length: 150 })
    lastName: string;

    @Column({ type: 'varchar', length: 100 })
    jobTitle: string;

    @Column({ type: 'varchar', length: 100 })
    department: string;
}