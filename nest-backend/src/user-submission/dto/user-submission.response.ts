// dto/stakeholder-submission-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { UserSubmission } from '../entities/user-submission.entity';

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
