import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDimensionInput } from './create-dimension.input';

@InputType()
export class UpdateDimensionInput extends PartialType(CreateDimensionInput) {
    // No id field here
}
