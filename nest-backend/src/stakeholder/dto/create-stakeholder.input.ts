// stakeholder/dto/create-stakeholder.input.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { Stakeholder } from '../entities/stakeholder.entity';

@InputType()
export class CreateStakeholderInput extends OmitType(
    Stakeholder,
    ['id', 'avgImpact', 'avgInfluence', 'activity'] as const,
    InputType,
) {
    // ✅ Inherits: name, description, activityId, scoreQuadrant
    // ✅ Excludes: id, createdAt, updatedAt
}
