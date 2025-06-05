// dto/stakeholder-submission-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { UserSubmission } from '../entities/user-submission.entity';
import { StakeholderRating } from '../entities/stakeholder-rating.entity';

@ObjectType()
export class UserSubmissionResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => UserSubmission)
    data: UserSubmission;
}

@ObjectType()
export class UserSubmissionsResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [UserSubmission])
    data: UserSubmission[];
}

@ObjectType()
export class UserSubmissionData {
    @Field()
    userName: string;

    @Field()
    userId: string;

    @Field(() => [StakeholderRating])
    stakeholderRatings: StakeholderRating[];
}

@ObjectType()
export class UserSubmissionsByReportResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => String) // JSON string representation of the data object
    data: string; // Will be JSON.stringify of Record<string, UserSubmissionData>
}
