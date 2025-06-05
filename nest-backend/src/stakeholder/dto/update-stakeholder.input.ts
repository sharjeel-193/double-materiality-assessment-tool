// stakeholder/dto/update-stakeholder.input.ts
import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { Stakeholder } from '../entities/stakeholder.entity';

@InputType()
export class UpdateStakeholderInput extends PartialType(
    OmitType(Stakeholder, ['id', 'activity'] as const, InputType),
) {
    // ✅ All fields optional: name?, description?, activityId?, scoreQuadrant?
    // ✅ Excludes: id, createdAt, updatedAt
}
