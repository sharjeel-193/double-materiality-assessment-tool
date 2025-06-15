import { ObjectType, Field, ID, Float, InputType } from '@nestjs/graphql';
import { Topic } from '../../topic/entities/topic.entity';
import { Report } from '../../report/entities/report.entity';
import { FinancialEffectType } from '../../common/enums';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    IsEnum,
    IsNumber,
} from 'class-validator';

@ObjectType()
@InputType('FinancialEffectInput')
export class FinancialEffect {
    @Field(() => ID)
    @IsUUID()
    id: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field(() => Float)
    @IsNumber()
    likelihood: number;

    @Field(() => Float)
    @IsNumber()
    magnitude: number;

    @Field(() => FinancialEffectType)
    @IsEnum(FinancialEffectType)
    type: FinancialEffectType;

    @Field(() => ID)
    @IsUUID()
    topicId: string;

    @Field(() => ID)
    @IsUUID()
    reportId: string;

    // Relations (without validators since they're populated by Prisma)
    @Field(() => Topic, { nullable: true })
    topic?: Topic;

    @Field(() => Report, { nullable: true })
    report?: Report;
}
