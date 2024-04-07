import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { BcryptService } from '../common/services/bcrypt/bcrypt.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async findOne(_id: string): Promise<User> {
    return this.usersRepository.findOne({ _id });
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      return await this.usersRepository.create({
        ...createUserInput,
        password: await this.bcryptService.hash(createUserInput.password),
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new UnprocessableEntityException('Email is already taken.');
      }

      throw error;
    }
  }

  async update(_id: string, updateUserInput: UpdateUserInput): Promise<User> {
    if (updateUserInput?.password) {
      updateUserInput.password = await this.bcryptService.hash(
        updateUserInput.password,
      );
    }

    return this.usersRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
        },
      },
    );
  }

  async delete(_id: string): Promise<User> {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });

    const isPasswordValid = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    return user;
  }
}
