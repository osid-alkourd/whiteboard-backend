import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { WhiteboardSnapshotsService } from './whiteboard-snapshots.service';
import { SaveSnapshotDto } from './dto/save-snapshot.dto';
import { WhiteboardsService } from '../whiteboards/whiteboards.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('whiteboards/:whiteboardId/snapshots')
@UseGuards(JwtAuthGuard)
export class WhiteboardSnapshotsController {
  constructor(
    private readonly snapshotsService: WhiteboardSnapshotsService,
    private readonly whiteboardsService: WhiteboardsService,
  ) {}

  /**
   * Save or update snapshot for a whiteboard
   * If whiteboard has no snapshots, create a new one
   * If whiteboard has snapshots, update the latest one
   * Requires authentication and access permission (owner or collaborator)
   * @param whiteboardId - Whiteboard ID (must be a valid UUID)
   * @param saveSnapshotDto - Snapshot data containing shapes and drawings
   * @param user - Current authenticated user (from JWT token)
   * @param res - Express response object for setting status codes
   * @returns Saved or updated snapshot information
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async saveSnapshot(
    @Param('whiteboardId', ParseUUIDPipe) whiteboardId: string,
    @Body(ValidationPipe) saveSnapshotDto: SaveSnapshotDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // Check if whiteboard exists and user has access
      // This will throw NotFoundException if whiteboard doesn't exist
      // or ForbiddenException if user doesn't have access
      const whiteboard = await this.whiteboardsService.findByIdWithAccess(
        whiteboardId,
        user,
      );

      // Save or update snapshot
      const snapshot = await this.snapshotsService.saveOrUpdateSnapshotForWhiteboard(
        whiteboard,
        saveSnapshotDto.data,
      );

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Snapshot saved successfully',
        data: {
          id: snapshot.id,
          data: snapshot.data,
          createdAt: snapshot.createdAt,
          updatedAt: snapshot.updatedAt,
        },
      };
    } catch (error) {
      // Handle different error types and set appropriate HTTP status codes
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND);
        return {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Whiteboard not found',
          data: null,
        };
      }

      if (error instanceof ForbiddenException) {
        res.status(HttpStatus.FORBIDDEN);
        return {
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          message: error.message || 'You do not have permission to save snapshots for this whiteboard',
          data: null,
        };
      }

      // Handle other errors (database errors, etc.)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to save snapshot',
        error: error.message,
        data: null,
      };
    }
  }
}

