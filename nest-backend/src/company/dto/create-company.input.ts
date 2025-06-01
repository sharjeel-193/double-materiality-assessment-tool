import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCompanyInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    address?: string;
}
