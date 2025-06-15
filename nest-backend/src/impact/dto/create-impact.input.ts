import { InputType, OmitType } from '@nestjs/graphql';
import { Impact } from '../entities/impact.entity';

@InputType()
export class CreateImpactInput extends OmitType(
    Impact,
    ['id', 'topic', 'report'] as const,
    InputType,
) {}
