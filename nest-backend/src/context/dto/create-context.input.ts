// context/dto/create-context.input.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { Context } from '../entities/context.enitity';

@InputType()
export class CreateContextInput extends OmitType(
    Context,
    ['id', 'createdAt', 'updatedAt'] as const,
    InputType,
) {
    // ✅ Inherits all fields except id, createdAt, updatedAt
    // ✅ All validations from entity are preserved
}
