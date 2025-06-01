import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('StandardInput')
export class Standard {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;
}
