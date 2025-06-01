import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Dimension {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    standardId: string;
}
