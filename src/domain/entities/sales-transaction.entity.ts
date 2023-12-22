import { PrimaryGeneratedColumn, Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class SalesTransaction extends BaseEntity {
  constructor(partial: Partial<SalesTransaction>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  transactionId!: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId!: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  @Index()
  itemName!: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  payment!: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  transactionCode!: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  source!: string;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  amount!: number;
}
