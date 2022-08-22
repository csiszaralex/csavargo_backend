import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrPosDto } from './dto/update-qr-pos.dto';
import { AuthGuard } from '@nestjs/passport';
import { AlexGuard } from 'src/csoport/guards/alex.guard';
import { Qr } from '@prisma/client';
import { VerifyQrDto } from './dto/verify-qr.dto';
import { JustAuthGuard } from 'src/csoport/guards/just-aut.guard';
import { GetId } from 'src/csoport/decorators/get-id.decorator';

@Controller('qr')
@UseGuards(AlexGuard)
@UseGuards(AuthGuard())
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get()
  findAll(): Promise<Qr[]> {
    return this.qrService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Qr> {
    return this.qrService.findOne(id);
  }

  @UseGuards(JustAuthGuard)
  @Post('/available')
  available(@Body() verifyQrDto: VerifyQrDto, @GetId() id: number): Promise<{ available: boolean; id: number }> {
    return this.qrService.available(verifyQrDto, id);
  }

  @Post()
  create(@Body() createQrDto: CreateQrDto): Promise<Qr> {
    return this.qrService.create(createQrDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateQrDto: CreateQrDto): Promise<Qr> {
    return this.qrService.update(id, updateQrDto);
  }

  @Post('/move/:id')
  move(@Param('id', ParseIntPipe) id: number, @Body() updateQrPosDto: UpdateQrPosDto): Promise<Qr> {
    return this.qrService.move(id, updateQrPosDto);
  }

  @Post('/disable/:id')
  disable(@Param('id', ParseIntPipe) id: number): Promise<Qr> {
    return this.qrService.disable(id);
  }
}
