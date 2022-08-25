import { Controller, Post, Body } from '@nestjs/common';
import { HibaService } from './hiba.service';
import { CreateHibaDto } from './dto/create-hiba.dto';

@Controller('hiba')
export class HibaController {
  constructor(private readonly hibaService: HibaService) {}

  @Post()
  create(@Body() createHibaDto: CreateHibaDto) {
    return this.hibaService.create(createHibaDto);
  }
}
