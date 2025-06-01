import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
    @Field()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @Field()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(1, { message: 'Password cannot be empty' })
    password: string;
}
