import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsEmail,
  ValidateIf,
  ArrayMinSize,
} from 'class-validator';

export enum BoardAccessType {
  PRIVATE = 'private',
  INVITE_SPECIFIC_USERS = 'invite_specific_users',
}

export class CreateWhiteboardDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsEnum(BoardAccessType, {
    message: 'Board access must be either "private" or "invite_specific_users"',
  })
  @IsNotEmpty({ message: 'Board access type is required' })
  boardAccess: BoardAccessType;

  @IsArray({ message: 'Invited emails must be an array' })
  @IsEmail({}, { each: true, message: 'Each invited email must be a valid email address' })
  @ArrayMinSize(1, {
    message: 'At least one email is required when inviting specific users',
  })
  @ValidateIf((o) => o.boardAccess === BoardAccessType.INVITE_SPECIFIC_USERS)
  @IsNotEmpty({
    message: 'Invited emails are required when access type is invite_specific_users',
  })
  invitedEmails?: string[];
}

