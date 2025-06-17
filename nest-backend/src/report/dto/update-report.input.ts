// report/dto/update-report.dto.ts
import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Report } from '../entities/report.entity';

@InputType()
export class UpdateReportInput extends PartialType(
    OmitType(
        Report,
        [
            'id',
            'companyId',
            'company',
            'standardId',
            'context',
            'standard',
        ] as const,
        InputType,
    ),
) {}
