import { Controller, Post, Body } from '@nestjs/common';
import { CsoportService } from './csoport.service';
import { SigninCsoportDto } from './dto/signin-csoport.dto';

@Controller('csoport')
export class CsoportController {
  constructor(private readonly csoportService: CsoportService) {}

  @Post('signin')
  signin(@Body() signinCsoportDto: SigninCsoportDto) {
    return this.csoportService.signin(signinCsoportDto);
  }
}
