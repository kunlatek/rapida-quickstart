import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Invitation extends BaseEntity {
  @Column()
  email: string;

  @Column()
  permission: string;

  @Column({ default: false })
  accepted: boolean;
}
