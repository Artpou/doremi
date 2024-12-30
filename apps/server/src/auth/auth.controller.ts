import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserService } from 'src/user/user.service';

import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, RegisterDto, TokenResponse } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @Throttle({ short: { limit: 2, ttl: 1000 } })
  @ApiOkResponse({ type: TokenResponse })
  async register(@Body() dto: RegisterDto): Promise<TokenResponse> {
    return await this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ short: { limit: 2, ttl: 1000 } })
  @ApiOkResponse({ type: TokenResponse })
  async login(@Body() dto: LoginDto): Promise<TokenResponse> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @Throttle({ short: { limit: 2, ttl: 1000 } })
  @ApiOkResponse({ type: TokenResponse })
  async refreshToken(@Body() dto: RefreshDto): Promise<TokenResponse> {
    return await this.authService.refreshToken(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@Request() req: Request) {
    // @ts-expect-error req.user is not typed
    return await this.userService.findById(req.user);
  }

  @Get('test')
  async test() {
    return {
      message: 'Hello World',
    };
  }
}
