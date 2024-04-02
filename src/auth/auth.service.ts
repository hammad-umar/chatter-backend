import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { JwtTokenPayload } from '../common/interfaces/jwt-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response): Promise<void> {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        this.configService.getOrThrow<number>('JWT_EXPIRATION'),
    );

    const jwtTokenPayload: JwtTokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const jwtToken = this.jwtService.sign(jwtTokenPayload);

    response.cookie('Authentication', jwtToken, {
      httpOnly: true,
      expires,
    });
  }
}
