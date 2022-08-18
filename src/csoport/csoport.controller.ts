import { Controller, Post, Body, Get, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlexGuard } from 'src/csoport/guards/alex.guard';
import { CsoportService } from './csoport.service';
import { GetId } from './decorators/get-id.decorator';
import { SigninCsoportDto } from './dto/signin-csoport.dto';

@Controller('csoport')
export class CsoportController {
  constructor(private readonly csoportService: CsoportService) {}

  @Post('signin')
  signin(@Body() signinCsoportDto: SigninCsoportDto) {
    return this.csoportService.signin(signinCsoportDto);
  }

  @Get('renew')
  @UseGuards(AuthGuard())
  renew(@GetId() id: number) {
    return this.csoportService.renew(id);
  }

  @Post('disable/:id')
  @UseGuards(AlexGuard)
  @UseGuards(AuthGuard())
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.csoportService.disable(id);
  }

  @Post('pass/:id')
  @UseGuards(AlexGuard)
  @UseGuards(AuthGuard())
  editPass(@Param('id', ParseIntPipe) id: number, @Body() signinCsoportDto: SigninCsoportDto) {
    return this.csoportService.editPass(id, signinCsoportDto);
  }
}
