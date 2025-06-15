import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Impact } from '../entities/impact.entity';

@InputType()
export class UpdateImpactInput extends PartialType(
    OmitType(Impact, ['id', 'topic', 'report'] as const, InputType),
) {}
