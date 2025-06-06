import {
    Field,
    ID,
    InputType,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TopicRating } from './topic-rating.entity';

export enum SubmissionType {
    INTERNAL = 'INTERNAL',
    STAKEHOLDER = 'STAKEHOLDER',
}

registerEnumType(SubmissionType, {
    name: 'SubmissionType',
});

@ObjectType()
@InputType('StakeholderSubmissionInput')
export class StakeholderSubmission {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    @IsString()
    stakeholderId?: string;

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
}
