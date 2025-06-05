// user-submission/dto/create-user-submission.input.ts
import { InputType, OmitType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserSubmission } from '../entities/user-submission.entity';
import { CreateStakeholderRatingInput } from './create-stakeholder-rating.input';

@InputType()
export class CreateUserSubmissionInput extends OmitType(
    UserSubmission,
    ['id', 'createdAt', 'updatedAt', 'stakeholderRatings', 'user'] as const, // ✅ Exclude virtual field
    InputType,
) {
    // ✅ Inherits: userId, stakeholderId, type
    // ✅ Excludes: id, createdAt, updatedAt, stakeholderRatings

    // ✅ Add stakeholder ratings as separate input
    @Field(() => [CreateStakeholderRatingInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateStakeholderRatingInput)
    stakeholderRatings: CreateStakeholderRatingInput[];
}
