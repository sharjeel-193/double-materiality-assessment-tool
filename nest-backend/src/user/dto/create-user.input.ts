import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
    IsEmail,
    IsString,
    MinLength,
    IsNotEmpty,
    IsEnum,
} from 'class-validator';

// Define the enum
export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    TEAM_LEADER = 'TEAM_LEADER',
    TEAM_MEMBER = 'TEAM_MEMBER',
}

// Register the enum for GraphQL
registerEnumType(UserRole, {
    name: 'UserRole',
    description: 'User role types',
});

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @Field()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @Field(() => UserRole)
    @IsEnum(UserRole, {
        message: 'Role must be one of: SUPER_ADMIN, TEAM_LEADER, TEAM_MEMBER',
    })
    role: UserRole;

    @Field()
    @IsString()
    @IsNotEmpty()
    companyId: string;
}
