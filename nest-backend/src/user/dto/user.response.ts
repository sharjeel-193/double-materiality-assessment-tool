// src/user/dto/user.response.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => User, { nullable: true })
    data?: User;
}

@ObjectType()
export class UsersResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [User])
    data: User[];
}
