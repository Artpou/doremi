import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/user/user.service';
import ms from 'ms';

import { LoginDto, RefreshDto, RegisterDto, TokenResponse } from './auth.dto';

const ACCESS_TOKEN_EXPIRE_TIME = '30m';
const REFRESH_TOKEN_EXPIRE_TIME = '30d';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  private async getTokens(id: string | number) {
    const expiresIn = Date.now() + ms(ACCESS_TOKEN_EXPIRE_TIME);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        { sub: id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
        },
      ),
      await this.jwtService.signAsync(
        { sub: id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
        },
      ),
    ]);

    return { token, refreshToken, expiresIn };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id);

    return { ...tokens, email: user.email };
  }

  async register(dto: RegisterDto): Promise<TokenResponse> {
    const user = await this.usersService.create(dto);
    const tokens = await this.getTokens(user.id);

    return { ...tokens, email: user.email };
  }

  async refreshToken(dto: RefreshDto): Promise<TokenResponse> {
    const test = jwtDecode(dto.refresh);
    if (!test.sub) throw new UnauthorizedException('Invalid token');

    const user = await this.usersService.findById(Number(test.sub));

    if (!user) throw new UnauthorizedException('User not found');

    const tokens = await this.getTokens(user.id);

    return { ...tokens, email: user.email };
  }
}
