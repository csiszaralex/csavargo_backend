import { Controller, Post, Body, Get, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Csoport } from '@prisma/client';
import { AlexGuard } from 'src/csoport/guards/alex.guard';
import { CsoportService } from './csoport.service';
import { GetId } from './decorators/get-id.decorator';
import { SigninCsoportDto } from './dto/signin-csoport.dto';
import { SignInPayloadInterface } from './interfaces/signin-payload.interface';

@Controller('csoport')
export class CsoportController {
  constructor(private readonly csoportService: CsoportService) {}

  @Post('signin')
  signin(@Body() signinCsoportDto: SigninCsoportDto): Promise<SignInPayloadInterface> {
    return this.csoportService.signin(signinCsoportDto);
  }

  @Get('renew')
  @UseGuards(AuthGuard())
  renew(@GetId() id: number): Promise<SignInPayloadInterface> {
    return this.csoportService.renew(id);
  }

  @Post('disable/:id')
  @UseGuards(AlexGuard)
  @UseGuards(AuthGuard())
  disable(@Param('id', ParseIntPipe) id: number): Promise<Csoport> {
    return this.csoportService.disable(id);
  }

  @Post('pass/:id')
  @UseGuards(AlexGuard)
  @UseGuards(AuthGuard())
  editPass(
    @Param('id', ParseIntPipe) id: number,
    @Body() signinCsoportDto: SigninCsoportDto,
  ): Promise<Csoport> {
    return this.csoportService.editPass(id, signinCsoportDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  getQrs(@GetId() id: number) {
    return this.csoportService.getQrs(id);
  }

  @Get('osztaly')
  @UseGuards(AuthGuard())
  getQrOsztaly(@GetId() id: number) {
    return this.csoportService.getQrOsztaly(id);
  }

  @Get('stat')
  @UseGuards(AlexGuard)
  @UseGuards(AuthGuard())
  getStat() {
    return this.csoportService.getStat();
  }
  @Get('stat/osztaly')
  @UseGuards(AlexGuard)
  @UseGuards(AuthGuard())
  getOsztalyStat() {
    return this.csoportService.getOsztalyStat();
  }
}
