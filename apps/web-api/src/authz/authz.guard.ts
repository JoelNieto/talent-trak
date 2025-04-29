import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from '../app/users/users.service';

@Injectable()
// AuthGuard is a class that is used to protect routes in NestJS applications.
export class AuthzGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly users: UsersService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const jwt = new JwtService();
    if (token) {
      try {
        const payload = jwt.decode(token, { json: true });
        const response = await fetch(payload.aud[1], {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.error) {
          throw new UnauthorizedException('Invalid token', {
            cause: new Error(data.error),
            description: 'Token validation failed',
          });
        }
        request['authInfo'] = data;
        const user = await this.users.findByEmail(data.email);
        if (!user) {
          throw new UnauthorizedException('User not found', {
            cause: new Error(),
            description: 'User not found in the database',
          });
        }
        request['user'] = user;
        return true;
      } catch (error) {
        Logger.error('Error validating token', error);
        throw new UnauthorizedException('Invalid token');
      }
    }
    throw new UnauthorizedException('Token not provided', {
      cause: new Error(),
      description: 'Token missing on request header',
    });
  }

  handleRequest(
    ...args: Parameters<
      InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
    >
  ) {
    return super.handleRequest(...args);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
