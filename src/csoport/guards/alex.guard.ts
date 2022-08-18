import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AlexGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest();

    return user.osztaly === 'admin';
  }
}
