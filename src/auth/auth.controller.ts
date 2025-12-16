import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * Creates a user account and sets an HttpOnly cookie with JWT token
   * @param registerDto - Registration data (email, password, fullName)
   * @param res - Express response object
   * @returns Created user information (without sensitive data)
   */
  @Post('register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Res() res: Response,
  ) {
    // Create user account
    const user = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.fullName,
    );

    // Generate JWT token
    const token = this.authService.generateToken(user);

    // Set HttpOnly cookie (not accessible by JavaScript for security)
    const cookieOptions = {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict' as const, // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Cookie available for all paths
    };

    res.cookie('token', token, cookieOptions);

    return res.status(HttpStatus.CREATED).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }
}

