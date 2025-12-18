import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for adding a collaborator to a whiteboard
 */
export class AddCollaboratorDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

