// context/entities/activity.entity.ts
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum ActivityType {
    UPSTREAM = 'UPSTREAM',
    DOWNSTREAM = 'DOWNSTREAM',
}

registerEnumType(ActivityType, {
    name: 'ActivityType',
    description: 'Position in value chain',
});
@ObjectType()
@InputType('ActivityInput')
export class Activity {
    @Field(() => ID)
    id: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => ActivityType)
    @IsEnum(ActivityType)
    type: ActivityType;

    @Field(() => ID)
    @IsNotEmpty()
    contextId: string;
}
