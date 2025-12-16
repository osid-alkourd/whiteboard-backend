import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';

/**
 * JWT Payload interface
 * Contains the data stored in the JWT token
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string; // User email
}

/**
 * JWT Strategy for Passport
 * Extracts JWT from HttpOnly cookie and validates it
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extract token from HttpOnly cookie
          return request?.cookies?.token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  /**
   * Validate JWT payload and return user
   * This method is called after JWT is verified
   * @param payload - Decoded JWT payload
   * @returns User entity
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}

