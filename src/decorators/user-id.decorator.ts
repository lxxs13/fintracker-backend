import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const UserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();

        if (!request.user?.userId) throw new UnauthorizedException('User ID not found in token');

        return request.user?.userId;
    },
);