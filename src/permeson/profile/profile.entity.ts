import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  pictureProfile: string;

  @Column()
  user: string;
}
