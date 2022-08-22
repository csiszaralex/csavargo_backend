import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JustAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user } = ctx.switchToHttp().getRequest();

    return user;
  }
}
