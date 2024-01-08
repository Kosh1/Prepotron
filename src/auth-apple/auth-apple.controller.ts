import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthAppleService } from './auth-apple.service';

@ApiTags('Auth')
@Controller({
  path: 'auth/apple',
  version: '1',
})
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authAppleService: AuthAppleService,
  ) {}

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // async login(@Body() loginDto: AuthAppleLoginDto): Promise<LoginResponseType> {
  //   const socialData = await this.authAppleService.getProfileByToken(loginDto);

  //   return this.authService.validateSocialLogin('apple', socialData);
  // }
}
