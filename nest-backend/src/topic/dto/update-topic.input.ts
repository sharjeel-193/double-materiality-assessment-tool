import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateTopicInput {
    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    id: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    dimensionId?: string;
}
