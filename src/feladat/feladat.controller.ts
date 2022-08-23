import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetId } from 'src/csoport/decorators/get-id.decorator';
import { AlexGuard } from 'src/csoport/guards/alex.guard';
import { TryFeladatDto } from './dto/try-feladat.dto';
import { FeladatService } from './feladat.service';

@Controller('feladat')
@UseGuards(AuthGuard())
export class FeladatController {
  constructor(private readonly feladatService: FeladatService) {}

  @Get('get/:id')
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

  @UseGuards(AlexGuard)
  @Get('/acceptable')
  async getAcceptable() {
    return this.feladatService.getAcceptable();
  }
  @UseGuards(AlexGuard)
  @Get('/accept/:id')
  async accept(@Param('id') id: number) {
    return this.feladatService.accept(id);
  }
  @UseGuards(AlexGuard)
  @Get('/decline/:id')
  async decline(@Param('id') id: number) {
    return this.feladatService.decline(id);
  }
}
