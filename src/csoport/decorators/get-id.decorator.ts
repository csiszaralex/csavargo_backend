import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Csoport } from '@prisma/client';

export const GetId = createParamDecorator((_, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest();

  const csoport: Csoport = req.user;

  return csoport.id;
});
