import type { AuthenticatedRequest } from './auth';

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserService } from 'src/user/user.service';

import { AuthService } from './auth.service';
import {
  LoginDto,
  RefreshDto,
  RegisterDto,
  SpotifyAuthDto,
  TokenResponse,
} from './auth.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOkResponse({ type: TokenResponse })
  async register(@Body() dto: RegisterDto): Promise<TokenResponse> {
    return await this.authService.register(dto);
  }

  @Post('spotify')
  @ApiOkResponse({ type: TokenResponse })
  async spotifyAuth(@Body() dto: SpotifyAuthDto): Promise<TokenResponse> {
    return this.authService.authenticateSpotify(dto);
  }

  @Post('login')
  @ApiOkResponse({ type: TokenResponse })
  async login(@Body() dto: LoginDto): Promise<TokenResponse> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 1, ttl: 1000 } })
  @ApiOkResponse({ type: TokenResponse })
  async refreshToken(@Body() dto: RefreshDto): Promise<TokenResponse> {
    return await this.authService.refreshToken(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: AuthenticatedRequest) {
    return await this.userService.findById(req.user.id);
  }

  @Get('test')
  async test() {
    return {
      message: 'Hello World',
    };
  }
}
