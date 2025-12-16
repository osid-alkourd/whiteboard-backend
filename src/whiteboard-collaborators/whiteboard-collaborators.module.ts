import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteboardCollaboratorsService } from './whiteboard-collaborators.service';
import { WhiteboardCollaborator } from './entities/whiteboard-collaborator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhiteboardCollaborator])],
  providers: [WhiteboardCollaboratorsService],
  exports: [WhiteboardCollaboratorsService],
})
export class WhiteboardCollaboratorsModule {}

