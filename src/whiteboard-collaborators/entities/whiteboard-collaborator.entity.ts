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
import { User } from '../../users/entities/user.entity';

export type CollaboratorRole = 'viewer' | 'editor';

@Entity({ name: 'whiteboard_collaborators' })
export class WhiteboardCollaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Whiteboard, (whiteboard) => whiteboard.collaborators, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'whiteboard_id' })
  whiteboard: Whiteboard;

  @ManyToOne(() => User, (user) => user.collaborations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['viewer', 'editor'],
    default: 'viewer',
  })
  role: CollaboratorRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
