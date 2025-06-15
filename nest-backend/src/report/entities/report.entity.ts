// report/entities/report.entity.ts
import { ObjectType, Field, ID, Int, InputType } from '@nestjs/graphql';
import { Context } from 'src/context/entities/context.enitity';

@ObjectType()
@InputType('ReportInput')
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

    @Field(() => Context, { nullable: true })
    context: Context;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
