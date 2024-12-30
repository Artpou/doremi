import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/user/user.service';
import ms from 'ms';
import { ProviderService } from 'src/provider/provider.service';
import { SpotifyService } from 'src/spotify/spotify.service';

import { LoginDto, RefreshDto, RegisterDto, TokenResponse } from './auth.dto';

// due to spotify's token expiration
const ACCESS_TOKEN_EXPIRE_TIME = '30m';
const REFRESH_TOKEN_EXPIRE_TIME = '59m';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private providerService: ProviderService,
    private spotifyService: SpotifyService,
  ) {}

  private async getTokens(id: string | number) {
    const expires_in = Date.now() + ms(ACCESS_TOKEN_EXPIRE_TIME);

    const [access_token, refresh_token] = await Promise.all([
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

    return {
      access_token,
      refresh_token,
      expires_in,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) return null;

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
    if (!test.sub || !test.exp)
      throw new UnauthorizedException('Invalid token');

    const isExpired = Date.now() > test.exp * 1000;
    if (isExpired) throw new UnauthorizedException('Token expired');

    const user = await this.usersService.findById(Number(test.sub));

    if (!user) throw new UnauthorizedException('User not found');

    const provider = await this.providerService.findByUserId(user.id);

    if (provider?.name === 'spotify' && provider.refresh_token) {
      const token = await this.spotifyService.refreshToken(
        provider.refresh_token,
      );

      await this.providerService.update(provider.id, {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      });
    }

    const tokens = await this.getTokens(user.id);

    return { ...tokens, email: user.email };
  }

  async authenticateSpotify(dto: {
    email: string;
    id: string;
    access_token: string;
    refresh_token: string;
  }): Promise<TokenResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    const provider = user
      ? await this.providerService.findByUserId(user.id)
      : null;

    if (user && !provider) {
      throw new ConflictException('User exists but no provider');
    }

    if (!user) {
      const newUser = await this.usersService.create({
        email: dto.email,
      });

      await this.providerService.create({
        id: dto.id,
        name: 'spotify',
        access_token: dto.access_token,
        refresh_token: dto.refresh_token,
        userId: newUser.id,
      });
    } else {
      await this.providerService.update(provider!.id, {
        id: dto.id,
        access_token: dto.access_token,
        refresh_token: dto.refresh_token,
      });
    }

    const newUser = await this.usersService.findByEmail(dto.email);
    if (!newUser) throw new UnauthorizedException('User not found');

    const tokens = await this.getTokens(newUser.id);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      email: newUser.email,
      provider: 'spotify',
    };
  }
}
