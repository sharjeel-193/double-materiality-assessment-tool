import { InputType, OmitType } from '@nestjs/graphql';
import { FinancialEffect } from '../entities/financial-effect.entity';

@InputType()
export class CreateFinancialEffectInput extends OmitType(
    FinancialEffect,
    ['id', 'topic', 'report'] as const,
    InputType,
) {}
