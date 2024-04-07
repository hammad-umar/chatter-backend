import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GraphQlAuthGuard } from '../common/guards/graphql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtTokenPayload } from '../common/interfaces/jwt-token-payload.interface';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(GraphQlAuthGuard)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GraphQlAuthGuard)
  async findOne(@Args('_id') _id: string): Promise<User> {
    return this.usersService.findOne(_id);
  }

  @Mutation(() => User, { name: 'createUser' })
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(GraphQlAuthGuard)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: JwtTokenPayload,
  ): Promise<User> {
    return this.usersService.update(user._id, updateUserInput);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UseGuards(GraphQlAuthGuard)
  async delete(@CurrentUser() user: JwtTokenPayload): Promise<User> {
    return this.usersService.delete(user._id);
  }

  @UseGuards(GraphQlAuthGuard)
  @Query(() => User, { name: 'me' })
  async getMe(@CurrentUser() user: JwtTokenPayload): Promise<JwtTokenPayload> {
    return user;
  }
}
