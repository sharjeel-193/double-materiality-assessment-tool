// dto/stakeholder-submission-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { StakeholderSubmission } from '../entities/stakeholder-submission.entity';
import { TopicRating } from '../entities/topic-rating.entity';

@ObjectType()
export class StakeholderSubmissionResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => StakeholderSubmission)
    data: StakeholderSubmission;
}

@ObjectType()
export class StakeholderSubmissionsResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [StakeholderSubmission])
    data: StakeholderSubmission[];
}

@ObjectType()
export class StakeholderSubmissionData {
    @Field()
    userName: string;

    @Field()
    userId: string;

    @Field(() => [TopicRating])
    stakeholderRatings: TopicRating[];
}

@ObjectType()
export class StakeholderSubmissionsByReportResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => String) // JSON string representation of the data object
    data: string; // Will be JSON.stringify of Record<string, UserSubmissionData>
}
