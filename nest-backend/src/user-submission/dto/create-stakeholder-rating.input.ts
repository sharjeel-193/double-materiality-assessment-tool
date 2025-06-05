// stakeholder-rating/dto/create-stakeholder-rating.input.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { StakeholderRating } from '../entities/stakeholder-rating.entity';

@InputType()
export class CreateStakeholderRatingInput extends OmitType(
    StakeholderRating,
    ['id', 'stakeholder', 'submissionId'] as const, // ✅ Only exclude id
    InputType,
) {
    // ✅ Inherits: submissionId, stakeholderId, influence, impact, score
    // ✅ Excludes: id only
}
