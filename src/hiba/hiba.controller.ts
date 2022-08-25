import { Controller, Post, Body, Req, Ip } from '@nestjs/common';
import { HibaService } from './hiba.service';
import { CreateHibaDto } from './dto/create-hiba.dto';
import { Request } from 'express';

@Controller('hiba')
export class HibaController {
  constructor(private readonly hibaService: HibaService) {}

  @Post()
  create(@Body() createHibaDto: CreateHibaDto, @Ip() ip: string, @Req() req: Request) {
    return this.hibaService.create(createHibaDto, ip, req.headers['user-agent']);
  }
}
