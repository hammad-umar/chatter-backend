import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './entities/user.entity';
import { DatabaseModule } from '../common/database/database.module';
import { BcryptService } from '../common/services/bcrypt/bcrypt.service';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository, BcryptService],
  exports: [UsersService],
})
export class UsersModule {}
