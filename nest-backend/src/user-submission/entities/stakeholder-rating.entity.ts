// stakeholder-rating/entities/stakeholder-rating.entity.ts
import { ObjectType, Field, ID, InputType, Float } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Min,
    Max,
} from 'class-validator';
import { Stakeholder } from 'src/stakeholder/entities/stakeholder.entity';

@ObjectType()
@InputType('StakeholderRatingInput')
export class StakeholderRating {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    submissionId: string;

    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    stakeholderId: string;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    @Max(5)
    influence: number;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    @Max(5)
    impact: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    score?: number;

    @Field(() => Stakeholder, { nullable: true })
    stakeholder?: Stakeholder;
}
