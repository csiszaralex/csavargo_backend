import { Controller, Param, UseGuards, Put } from '@nestjs/common';
import { QrcsoportService } from './qrcsoport.service';
import { AuthGuard } from '@nestjs/passport';
import { GetId } from 'src/csoport/decorators/get-id.decorator';
import { QrCsoport } from '@prisma/client';

@Controller('qrcsoport')
export class QrcsoportController {
  constructor(private readonly qrcsoportService: QrcsoportService) {}

  @Put(':id')
  @UseGuards(AuthGuard())
  create(@Param('id') id: number, @GetId() uid: number): Promise<QrCsoport> {
    return this.qrcsoportService.create(id, uid);
  }
}
