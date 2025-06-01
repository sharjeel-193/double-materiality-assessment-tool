import { ObjectType, InputType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../../common/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
@InputType('UserInput') // Unique name for input type
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field(() => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Field(() => ID)
    @IsString()
    companyId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    password: string;
}
