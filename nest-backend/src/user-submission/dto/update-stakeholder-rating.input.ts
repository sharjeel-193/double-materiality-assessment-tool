// stakeholder-rating/dto/update-stakeholder-rating.input.ts
import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { StakeholderRating } from '../entities/stakeholder-rating.entity';

@InputType()
export class UpdateStakeholderRatingInput extends PartialType(
    OmitType(
        StakeholderRating,
        ['id', 'submissionId', 'stakeholderId'] as const, // ✅ Can't change these after creation
        InputType,
    ),
) {
    // ✅ All optional: influence?, impact?, score?
    // ✅ Excludes: id, submissionId, stakeholderId (immutable after creation)
}
