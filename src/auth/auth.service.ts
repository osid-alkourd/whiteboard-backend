import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param email - User email address
   * @param password - User password (will be hashed)
   * @param fullName - User full name
   * @returns Created user entity
   */
  async register(
    email: string,
    password: string,
    fullName: string,
  ): Promise<User> {
    return await this.usersService.create(email, password, fullName);
  }

  /**
   * Login user with email and password
   * Validates credentials and returns user if authentication succeeds
   * @param email - User email address
   * @param password - User password (plain text)
   * @returns Authenticated user entity
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(email: string, password: string): Promise<User> {
    // Find user by email
    const user = await this.usersService.findByEmail(email.toLowerCase().trim());

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  /**
   * Generate JWT token for authenticated user
   * Uses JWT_SECRET from environment variables for signing
   * @param user - User entity
   * @returns JWT token string
   */
  generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    // JwtService automatically uses the secret configured in JwtModule.register()
    // The secret is: process.env.JWT_SECRET (from .env file)
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });
  }
}

