import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { User } from '../entities/user.entity';
import { Csoport } from '@prisma/client';

export const GetId = createParamDecorator((_, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest();
  const csoport: Csoport = req.csoport;

  return csoport.id;
});
