import { PrimaryGeneratedColumn, Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
@Index(["firstName", "lastName"])
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  firstName!: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  lastName!: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  @Index()
  username!: string;

  @Column({ type: 'varchar', nullable: false, length: 500 })
  password!: string;
}
