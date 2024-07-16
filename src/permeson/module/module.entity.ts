import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Module extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  description: string;

  @Column()
  route: string;

  @Column()
  icon: string;
}
