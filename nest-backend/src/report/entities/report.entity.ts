// report/entities/report.entity.ts
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Report {
    @Field(() => ID)
    id: string;

    @Field(() => Int)
    year: number;

    @Field(() => ID)
    companyId: string;

    @Field(() => ID)
    standardId: string;

    @Field(() => Int)
    totalTopics: number;

    @Field(() => Int)
    materialTopics: number;

    @Field(() => Int)
    totalImpacts: number;

    @Field(() => Int)
    materialImpacts: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
