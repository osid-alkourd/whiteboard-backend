import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Whiteboard } from '../../whiteboards/entities/whiteboard.entity';
import { User } from '../../users/entities/user.entity';

export type CollaboratorRole = 'editor' | 'owner';

@Entity({ name: 'whiteboard_collaborators' })
export class WhiteboardCollaborator {
  @PrimaryColumn({ name: 'whiteboard_id', type: 'uuid' })
  whiteboardId: string;

  @ManyToOne(() => Whiteboard, (whiteboard) => whiteboard.collaborators, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'whiteboard_id' })
  whiteboard: Whiteboard;

  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.collaborations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['editor', 'owner'],
    default: 'editor',
  })
  role: CollaboratorRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
