// src/user/user.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResponse, UsersResponse } from './dto/user.response';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => UserResponse)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ) {
        return this.userService.create(createUserInput);
    }

    @Mutation(() => UserResponse)
    async updateUser(
        @Args('id', { type: () => String }) id: string,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ) {
        return this.userService.update(id, updateUserInput);
    }

    @Query(() => UsersResponse)
    async users() {
        return this.userService.findAll();
    }

    @Query(() => UserResponse)
    async user(@Args('id', { type: () => String }) id: string) {
        return this.userService.findOne(id);
    }

    @Query(() => UsersResponse)
    async usersByCompany(
        @Args('companyId', { type: () => String }) companyId: string,
    ) {
        return this.userService.findByCompany(companyId);
    }
}
