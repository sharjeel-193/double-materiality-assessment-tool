import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { FinancialEffect } from '../entities/financial-effect.entity';

@InputType()
export class UpdateFinancialEffectInput extends PartialType(
    OmitType(FinancialEffect, ['id', 'topic', 'report'] as const, InputType),
) {}
