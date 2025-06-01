import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Dimension } from '../../dimension/entities/dimension.entity';

@ObjectType()
@InputType('TopicInput')
export class Topic {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    dimensionId: string;

    // Optional: Add dimension relation field
    @Field(() => Dimension, { nullable: true })
    dimension?: Dimension;
}
