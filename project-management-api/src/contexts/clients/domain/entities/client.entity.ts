import { CustomBaseEntity } from 'src/contexts/shared/infrastructure';
import { Column, Entity } from 'typeorm';

@Entity('clients')
export class Client extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  surname: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address?: string;
}
