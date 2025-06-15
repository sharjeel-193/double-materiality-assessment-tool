import { ObjectType, Field } from '@nestjs/graphql';
import { FinancialEffect } from '../entities/financial-effect.entity';

@ObjectType()
export class FinancialEffectResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => FinancialEffect)
    data: FinancialEffect;
}

@ObjectType()
export class FinancialEffectsResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [FinancialEffect])
    data: FinancialEffect[];
}
