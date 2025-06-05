// user-submission/entities/user-submission.entity.ts
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { StakeholderRating } from './stakeholder-rating.entity';
import { SubmissionType } from 'src/common/enums';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@InputType('UserSubmissionInput')
export class UserSubmission {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    @IsString()
    userId?: string;

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
    @Field(() => [StakeholderRating], { nullable: true })
    stakeholderRatings?: StakeholderRating[];

    @Field(() => User, { nullable: true })
    user?: User;
}
