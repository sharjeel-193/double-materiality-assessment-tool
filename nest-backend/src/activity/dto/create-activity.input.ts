// context/dto/create-context.input.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { Activity } from '../entities/activity.entity';

@InputType()
export class CreateActivityInput extends OmitType(
    Activity,
    ['id'] as const,
    InputType,
) {
    // ✅ Inherits all fields except id, createdAt, updatedAt
    // ✅ All validations from entity are preserved
}
