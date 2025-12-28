import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RenameWhiteboardDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;
}

