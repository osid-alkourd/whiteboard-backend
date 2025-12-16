import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../strategies/jwt.strategy';

/**
 * Authentication Middleware
 * Validates JWT token from cookies and attaches user to request object
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract token from HttpOnly cookie
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Verify and decode JWT token
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      // Fetch user from database
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request object for use in controllers
      (req as any).user = user;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}

