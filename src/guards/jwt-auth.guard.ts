import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private _jwtService: JwtService,
    private reflector: Reflector
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(process.env.IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this._extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Authorization header must be Bearer <token>');

    try {
      const { sub } = await this._jwtService.verifyAsync<{ sub: string }>(token);

      if (!sub) throw new UnauthorizedException('Token payload without sub');

      request['user'] = {
        userId: sub
      };

    } catch (err: any) {
      if (err?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token signature');
      }

      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }

      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const auth = request.headers?.authorization ?? '';
    const [scheme, raw] = String(auth).split(' ');

    if (!raw || String(scheme).toLowerCase() !== 'bearer') {
      return undefined;
    }

    return raw.replace(/^"|"$/g, '');
  }
}
