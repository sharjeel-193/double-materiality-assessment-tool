// dto/stakeholder-submission-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { StakeholderSubmission } from '../entities/stakeholder-submission.entity';

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
