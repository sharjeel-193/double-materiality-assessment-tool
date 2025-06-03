// context/dto/update-context.input.ts
import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Context } from '../entities/context.enitity';

@InputType()
export class UpdateContextInput extends PartialType(
    OmitType(
        Context,
        ['id', 'reportId', 'createdAt', 'updatedAt'] as const,
        InputType,
    ),
) {
    // ✅ All fields are optional (PartialType)
    // ✅ Excludes id, reportId, createdAt, updatedAt
    // ✅ All validations preserved
}
