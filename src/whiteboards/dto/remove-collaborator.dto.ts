import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for removing a collaborator from a whiteboard
 */
export class RemoveCollaboratorDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

