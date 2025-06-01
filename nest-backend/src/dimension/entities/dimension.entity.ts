import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('DimensionInput')
export class Dimension {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    standardId: string;
}
