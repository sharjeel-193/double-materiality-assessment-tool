import { Field, InputType, ObjectType, ID, Float } from '@nestjs/graphql';
import {
    IsOptional,
    IsString,
    IsNotEmpty,
    IsEnum,
    IsNumber,
    Min,
    Max,
} from 'class-validator';

import { TopicRatingType } from '../../common/enums';
import { Topic } from 'src/topic/entities/topic.entity';

@ObjectType()
@InputType('TopicRatingInput')
export class TopicRating {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    submissionId: string;

    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    topicId: string;

    @Field(() => TopicRatingType)
    @IsEnum(TopicRatingType)
    @IsNotEmpty()
    ratingType: TopicRatingType;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    @Max(5)
    magnitude: number;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    @Max(5)
    relevance: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    score?: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    remarks?: string;

    @Field(() => Topic, { nullable: true })
    topic?: Topic;
}
