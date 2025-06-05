// user-submission/entities/user-submission.entity.ts
import {
    ObjectType,
    Field,
    ID,
    InputType,
    registerEnumType,
} from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { StakeholderRating } from './stakeholder-rating.entity';

export enum SubmissionType {
    INTERNAL = 'INTERNAL',
    STAKEHOLDER = 'STAKEHOLDER',
}

registerEnumType(SubmissionType, {
    name: 'SubmissionType',
});

@ObjectType()
@InputType('UserSubmissionInput')
export class UserSubmission {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    @IsString()
    userId?: string;

    @Field(() => SubmissionType)
    @IsEnum(SubmissionType)
    @IsNotEmpty()
    type: SubmissionType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    // ✅ Virtual field - not in database, just for GraphQL queries
    @Field(() => [StakeholderRating], { nullable: true })
    stakeholderRatings?: StakeholderRating[];
}
