import { CustomBaseEntity } from 'src/contexts/shared/infrastructure';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from 'src/contexts/clients/domain/entities/client.entity';

@Entity('projects')
export class Project extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'uuid' })
  clientId: string;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
