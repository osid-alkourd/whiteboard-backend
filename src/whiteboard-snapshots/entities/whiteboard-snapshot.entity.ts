import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Whiteboard } from '../../whiteboards/entities/whiteboard.entity';

@Entity({ name: 'whiteboard_snapshots' })
export class WhiteboardSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Whiteboard, (whiteboard) => whiteboard.snapshots, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'whiteboard_id' })
  whiteboard: Whiteboard;

  @Column({ type: 'jsonb' })
  data: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}

