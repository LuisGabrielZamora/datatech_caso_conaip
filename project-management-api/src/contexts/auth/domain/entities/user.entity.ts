import { Column, Entity } from 'typeorm';
import { Roles } from '../enum';
import { CustomBaseEntity } from 'src/contexts/shared/infrastructure';

@Entity('users')
export class User extends CustomBaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', default: Roles.user })
  role: string;
}
