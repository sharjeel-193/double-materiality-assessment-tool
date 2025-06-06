import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class MaterialityMatrixItem {
    @Field()
    topicId: string;

    @Field()
    topicName: string;

    @Field(() => Float)
    impactScore: number;

    @Field(() => Float)
    financialScore: number;

    @Field()
    impactRatingsCount: number;

    @Field()
    financialRatingsCount: number;
}
