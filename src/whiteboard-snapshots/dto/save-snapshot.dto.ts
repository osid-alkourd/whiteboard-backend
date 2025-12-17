import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * DTO for saving whiteboard snapshot data
 * Contains the shapes and drawings data to be saved
 */
export class SaveSnapshotDto {
  @IsObject({ message: 'Data must be an object' })
  @IsNotEmpty({ message: 'Data cannot be empty' })
  data: Record<string, unknown>;
}

