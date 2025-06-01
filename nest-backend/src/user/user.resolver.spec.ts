import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => User, { description: 'Create a new user' })
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ) {
        try {
            const user = await this.userService.create(createUserInput);
            return user;
        } catch (error) {
            throw new BadRequestException(
                'Failed to create user: ' + error.message,
            );
        }
    }

    @Query(() => [User], { name: 'users', description: 'Get all users' })
    async findAll() {
        try {
            return await this.userService.findAll();
        } catch (error) {
            throw new BadRequestException(
                'Failed to fetch users: ' + error.message,
            );
        }
    }

    @Query(() => User, { name: 'user', description: 'Get a user by ID' })
    async findOne(@Args('id', { type: () => String }) id: string) {
        try {
            const user = await this.userService.findOne(id);
            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to fetch user: ' + error.message,
            );
        }
    }

    @Mutation(() => User, { description: 'Update a user' })
    async updateUser(
        @Args('id', { type: () => String }) id: string,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ) {
        try {
            const user = await this.userService.update(id, updateUserInput);
            return user;
        } catch (error) {
            throw new BadRequestException(
                'Failed to update user: ' + error.message,
            );
        }
    }

    @Mutation(() => Boolean, { description: 'Remove a user by ID' })
    async removeUser(@Args('id', { type: () => String }) id: string) {
        try {
            await this.userService.remove(id);
            return true;
        } catch (error) {
            throw new BadRequestException(
                'Failed to remove user: ' + error.message,
            );
        }
    }
}
