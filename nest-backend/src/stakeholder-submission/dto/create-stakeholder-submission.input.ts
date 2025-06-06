import { Field, InputType, OmitType } from '@nestjs/graphql';
import { StakeholderSubmission } from '../entities/stakeholder-submission.entity';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTopicRatingInput } from './create-topic-rating.input';

@InputType()
export class CreateStakeholderSubmissionInput extends OmitType(
    StakeholderSubmission,
    ['id', 'createdAt', 'updatedAt', 'topicRatings', 'stakeholder'] as const,
    InputType,
) {
    // ✅ Inherits: topicId, stakeholderId, type
    // ✅ Excludes: id, createdAt, updatedAt, topicRatings

    // ✅ Add stakeholder ratings as separate input
    @Field(() => [CreateTopicRatingInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTopicRatingInput)
    topicRatings: CreateTopicRatingInput[];
}
