import { CreateStandardInput } from './create-standard.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateStandardInput extends PartialType(CreateStandardInput) {
    @Field(() => ID)
    id: string;
}
