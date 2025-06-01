import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateStandardInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;
}
