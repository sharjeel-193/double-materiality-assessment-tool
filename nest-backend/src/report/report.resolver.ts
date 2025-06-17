// report/report.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { Report } from './entities/report.entity';
import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';
import { ReportResponse } from './dto/report-response';

@Resolver(() => Report)
export class ReportResolver {
    constructor(private readonly reportService: ReportService) {}

    @Query(() => ReportResponse)
    async reportByCompanyAndYear(
        @Args('companyId') companyId: string,
        @Args('year') year: number,
    ): Promise<ReportResponse> {
        const result = await this.reportService.getByCompanyAndYear(
            companyId,
            year,
        );
        return result;
    }

    @Mutation(() => ReportResponse)
    async createReport(
        @Args('createReportInput') createReportInput: CreateReportInput,
    ): Promise<ReportResponse> {
        const result = await this.reportService.createReport(createReportInput);
        return result;
    }

    @Mutation(() => ReportResponse)
    async updateReport(
        @Args('id') id: string,
        @Args('updateReportInput') updateReportInput: UpdateReportInput,
    ): Promise<ReportResponse> {
        const result = this.reportService.updateReport(id, updateReportInput);
        return result;
    }

    @Mutation(() => ReportResponse)
    async updateReportStatus(
        @Args('id') id: string,
        @Args('status') status: number,
    ): Promise<ReportResponse> {
        const result = this.reportService.updateReportStatus(id, status);
        return result;
    }
}
