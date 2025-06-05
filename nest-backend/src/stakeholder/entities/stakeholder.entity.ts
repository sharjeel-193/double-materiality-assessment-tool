// stakeholder/entities/stakeholder.entity.ts
import { ObjectType, Field, ID, InputType, Float } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    Min,
    Max,
} from 'class-validator';
import { Activity } from 'src/activity/entities/activity.entity';

@ObjectType()
@InputType('StakeholderInput')
export class Stakeholder {
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

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsString()
    activityId?: string;

    @Field(() => Float)
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    avgInfluence: number;

    @Field(() => Float)
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    avgImpact: number;

    @Field(() => Activity, { nullable: true }) // ✅ Add this line
    activity?: Activity;
}
