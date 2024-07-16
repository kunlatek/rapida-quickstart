import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  permissionId: string;
}
