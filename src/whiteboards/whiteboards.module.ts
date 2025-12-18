import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteboardsService } from './whiteboards.service';
import { WhiteboardsController } from './whiteboards.controller';
import { Whiteboard } from './entities/whiteboard.entity';
import { UsersModule } from '../users/users.module';
import { WhiteboardCollaboratorsModule } from '../whiteboard-collaborators/whiteboard-collaborators.module';
import { WhiteboardSnapshotsModule } from '../whiteboard-snapshots/whiteboard-snapshots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Whiteboard]),
    UsersModule,
    WhiteboardCollaboratorsModule,
    forwardRef(() => WhiteboardSnapshotsModule),
  ],
  controllers: [WhiteboardsController],
  providers: [WhiteboardsService],
  exports: [WhiteboardsService],
})
export class WhiteboardsModule {}

