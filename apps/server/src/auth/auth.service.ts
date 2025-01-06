import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { jwtDecode } from 'jwt-decode';
import ms from 'ms';

import {
  LoginBody,
  RefreshBody,
  RegisterBody,
  SpotifyAuthBody,
} from '@workspace/request/auth.request';

import { ProviderService } from '@/provider/provider.service';
import { SpotifyService } from '@/spotify/spotify.service';
import { UserResponse } from '@/user/user.schema';
import { UserService } from '@/user/user.service';

import { TokenResponse } from './auth.schema';

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

  private async getTokens(
    id: string | number,
  ): Promise<Omit<TokenResponse, 'email'>> {
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

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.usersService.findWithPassword(email);
    if (!user || !user.password)
      throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(values: LoginBody): Promise<TokenResponse> {
    const user = await this.validateUser(values.email, values.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id);

    return { ...tokens, email: user.email };
  }

  async register(values: RegisterBody): Promise<TokenResponse> {
    const [user] = await this.usersService.create({
      email: values.email,
      password: await hash(values.password, 10),
    });

    if (!user) throw new UnauthorizedException('User not found');

    const tokens = await this.getTokens(user.id);

    return { ...tokens, email: user.email };
  }

  async refreshToken(values: RefreshBody): Promise<TokenResponse> {
    const test = jwtDecode(values.refresh);

    if (!test.sub || !test.exp)
      throw new UnauthorizedException('Invalid token');

    const isExpired = Date.now() > test.exp * 1000;
    if (isExpired) throw new UnauthorizedException('Token expired');

    const user = await this.usersService.findById(Number(test.sub));

    if (!user) throw new UnauthorizedException('User not found');

    const provider = await this.providerService.find({ userId: user.id });

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

  async authenticateSpotify(values: SpotifyAuthBody): Promise<TokenResponse> {
    const user = await this.usersService.find({
      email: values.email,
    });
    const provider = user
      ? await this.providerService.find({ userId: user.id })
      : null;

    if (user && !provider) {
      throw new ConflictException('User exists but no provider');
    }

    if (!user) {
      const [newUser] = await this.usersService.create({
        email: values.email,
      });

      if (!newUser) throw new UnauthorizedException('User not created');

      await this.providerService.create({
        name: 'spotify',
        access_token: values.access_token,
        refresh_token: values.refresh_token,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_EXPIRE_TIME)),
      });
    } else {
      await this.providerService.update(provider!.id, {
        access_token: values.access_token,
        refresh_token: values.refresh_token,
        expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_EXPIRE_TIME)),
      });
    }

    const newUser = await this.usersService.find({ email: values.email });
    if (!newUser) throw new UnauthorizedException('User not found');

    const tokens = await this.getTokens(newUser.id);

    return { ...tokens, email: newUser.email, provider: 'spotify' };
  }
}
