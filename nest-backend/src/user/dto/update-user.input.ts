import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserInput, UserRole } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    role?: UserRole;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    companyId?: string;
}
