// activity/dto/update-activity.input.ts
import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { Activity } from '../entities/activity.entity';

@InputType()
export class UpdateActivityInput extends PartialType(
    OmitType(Activity, ['id', 'contextId'] as const, InputType),
) {
    // ✅ All fields optional: name?, description?, type?
    // ✅ Excludes: id, contextId, createdAt, updatedAt
}
