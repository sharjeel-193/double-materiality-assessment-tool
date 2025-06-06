import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TopicRating } from './topic-rating.entity';

import { SubmissionType } from '../../common/enums';
import { Stakeholder } from '../../stakeholder/entities/stakeholder.entity';
@ObjectType()
@InputType('StakeholderSubmissionInput')
export class StakeholderSubmission {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    @IsString()
    stakeholderId?: string;

    @Field(() => ID)
    @IsString()
    reportId?: string;

    @Field(() => SubmissionType)
    @IsEnum(SubmissionType)
    @IsNotEmpty()
    type: SubmissionType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    // ✅ Virtual field - not in database, just for GraphQL queries
    @Field(() => [TopicRating], { nullable: true })
    topicRatings?: TopicRating[];

    @Field(() => Stakeholder, { nullable: true })
    stakeholder?: Stakeholder;
}
