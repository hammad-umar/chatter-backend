import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<number>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, JwtStrategy],
})
export class AuthModule {}
