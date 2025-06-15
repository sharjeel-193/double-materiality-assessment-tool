import { ObjectType, Field, ID, Float, InputType } from '@nestjs/graphql';
import { Topic } from '../../topic/entities/topic.entity';
import { Report } from '../../report/entities/report.entity';
import { ImpactType, OrderOfImpact } from '../../common/enums';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    IsEnum,
    IsNumber,
} from 'class-validator';

@ObjectType()
@InputType('ImpactInput')
export class Impact {
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
    scale: number;

    @Field(() => Float)
    @IsNumber()
    scope: number;

    @Field(() => Float)
    @IsNumber()
    irremediability: number;

    @Field(() => Float)
    @IsNumber()
    likelihood: number;

    @Field(() => ImpactType)
    @IsEnum(ImpactType)
    type: ImpactType;

    @Field(() => OrderOfImpact)
    @IsEnum(OrderOfImpact)
    orderOfEffect: OrderOfImpact;

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
