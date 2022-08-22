import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetId } from 'src/csoport/decorators/get-id.decorator';
import { TryFeladatDto } from './dto/try-feladat.dto';
import { FeladatService } from './feladat.service';

@Controller('feladat')
@UseGuards(AuthGuard())
export class FeladatController {
  constructor(private readonly feladatService: FeladatService) {}

  @Get(':id')
  async getTask(@Param('id') id: number, @GetId() csopId: number) {
    return this.feladatService.getTask(id, csopId);
  }

  @Post('/try/:id')
  async try(
    @Body() tryFeladatDto: TryFeladatDto,
    @Param('id') id: number,
    @GetId() csopId: number,
  ) {
    return this.feladatService.try(tryFeladatDto, id, csopId);
  }
}
