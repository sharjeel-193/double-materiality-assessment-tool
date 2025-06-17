// common/dto/response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { Report } from '../entities/report.entity';

@ObjectType()
export class ReportResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => Report)
    data?: Report;
}
