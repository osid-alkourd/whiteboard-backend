import { IsObject, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating whiteboard snapshot data
 * snapshotData is optional and can be empty (user can clear the whiteboard)
 */
export class UpdateWhiteboardDto {
  @IsObject({ message: 'Snapshot data must be an object' })
  @IsOptional()
  snapshotData?: Record<string, unknown>;

  @IsString({ message: 'Snapshot ID must be a string' })
  @IsOptional()
  snapshotId?: string;
}

