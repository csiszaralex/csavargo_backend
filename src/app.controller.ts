import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  getHello(@Req() req: Request): string {
    // config();
    return `This backend server is running on <b>${process.env.PORT || 3000}</b>.<br/>
      Accepted cors origin: <b>${process.env.ORIGIN || '*'}</b><br/>
      This server use svagger and you reach it on 
        <b>${req.get('host')}/${process.env.SWAGGER_LINK || 'swagger'}</b><br/>`;
  }
}
