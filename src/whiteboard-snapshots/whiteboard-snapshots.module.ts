import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteboardSnapshotsService } from './whiteboard-snapshots.service';
import { WhiteboardSnapshotsController } from './whiteboard-snapshots.controller';
import { WhiteboardSnapshot } from './entities/whiteboard-snapshot.entity';
import { WhiteboardsModule } from '../whiteboards/whiteboards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhiteboardSnapshot]),
    WhiteboardsModule,
  ],
  controllers: [WhiteboardSnapshotsController],
  providers: [WhiteboardSnapshotsService],
  exports: [WhiteboardSnapshotsService],
})
export class WhiteboardSnapshotsModule {}

