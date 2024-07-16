import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ModulePermission {
  @Column()
  moduleId: string;

  @Column('simple-array')
  permissionActions: string[];
}

@Entity()
export class Permission extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  description: string;

  @Column({ default: false })
  isAdminPermission: boolean;

  @Column({ type: 'json' })
  modulePermissions: ModulePermission[];
}
