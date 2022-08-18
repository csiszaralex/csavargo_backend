import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  @Get('whoami')
  @UseGuards(AuthGuard())
  renew(@GetId() id: number) {
    return this.csoportService.whoami(id);
  }
}
