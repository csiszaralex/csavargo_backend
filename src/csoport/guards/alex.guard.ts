import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JustAuthGuard } from './just-aut.guard';

@Injectable()
export class AlexGuard extends JustAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user } = ctx.switchToHttp().getRequest();

    if (user.osztaly === 'admin') return true;

    return await super.canActivate(ctx);
  }
}
