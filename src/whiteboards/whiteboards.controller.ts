import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { WhiteboardsService } from './whiteboards.service';
import { CreateWhiteboardDto } from './dto/create-whiteboard.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('whiteboards')
@UseGuards(JwtAuthGuard)
export class WhiteboardsController {
  constructor(private readonly whiteboardsService: WhiteboardsService) {}

  /**
   * Create a new whiteboard
   * Requires authentication
   * @param createWhiteboardDto - Whiteboard creation data
   * @param user - Current authenticated user (from JWT token)
   * @returns Created whiteboard information
   */
  @Post()
  async create(
    @Body(ValidationPipe) createWhiteboardDto: CreateWhiteboardDto,
    @CurrentUser() user: User,
  ) {
    const whiteboard = await this.whiteboardsService.create(
      createWhiteboardDto,
      user,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Whiteboard created successfully',
      data: {
        id: whiteboard.id,
        title: whiteboard.title,
        description: whiteboard.description,
        isPublic: whiteboard.isPublic,
        owner: {
          id: whiteboard.owner.id,
          email: whiteboard.owner.email,
          fullName: whiteboard.owner.fullName,
        },
        collaborators: whiteboard.collaborators?.map((collab) => ({
          userId: collab.userId,
          user: {
            id: collab.user.id,
            email: collab.user.email,
            fullName: collab.user.fullName,
          },
          role: collab.role,
        })) || [],
        createdAt: whiteboard.createdAt,
        updatedAt: whiteboard.updatedAt,
      },
    };
  }
}

