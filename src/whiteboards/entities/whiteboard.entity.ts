import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'whiteboards' })
export class Whiteboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ManyToOne(() => User, (user) => user.whiteboards, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}

