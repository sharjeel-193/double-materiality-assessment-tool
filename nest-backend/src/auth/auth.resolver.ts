import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response';
import { LoginInput } from './dto/login.input';
import { UserResponse } from './dto/user.response';
import { GqlAuthGuard } from './auth.guard';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    // ✅ Login - returns only access token
    @Mutation(() => LoginResponse)
    async login(
        @Args('loginInput') loginInput: LoginInput,
    ): Promise<LoginResponse> {
        return this.authService.login(loginInput);
    }

    // ✅ Get current user - protected by auth guard
    @Query(() => UserResponse)
    @UseGuards(GqlAuthGuard)
    async me(@Context() context: any): Promise<UserResponse> {
        // The JWT strategy already validates and attaches user to request
        const userId = context.req.user.id;
        return this.authService.getCurrentUser(userId);
    }
}
