import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class Company {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    @IsOptional()
    description?: string;
}
