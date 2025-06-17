// report/dto/create-report.dto.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { Report } from '../entities/report.entity';

@InputType()
export class CreateReportInput extends OmitType(
    Report,
    [
        'id',
        'createdAt',
        'updatedAt',
        'context',
        'company',
        'standard',
        'topStakeholders',
        'topTopics',
        'importantStakeholders',
        'materialTopics',
        'totalImpacts',
        'totalFinancialEffects',
        'totalStakeholders',
        'totalTopics',
        'impactRadar',
        'financialRadar',
        'summary',
    ] as const,
    InputType,
) {}
