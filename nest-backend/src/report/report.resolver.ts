// report/report.resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from './entities/report.entity';
import { CreateReportInput } from './dto/create-report.input';
import { GqlAuthGuard } from '../auth/auth.guard';
import { ForbiddenException } from '@nestjs/common';

@Resolver(() => Report)
export class ReportResolver {
    constructor(private readonly reportService: ReportService) {}

    @Mutation(() => Report)
    @UseGuards(GqlAuthGuard)
    async createReport(
        @Args('createReportInput') createReportInput: CreateReportInput,
        @Context() context: any,
    ) {
        const user = context.req.user;

        // Ensure user can only create reports for their company
        if (user.companyId !== createReportInput.companyId) {
            throw new ForbiddenException(
                'You can only create reports for your company',
            );
        }

        return this.reportService.create(createReportInput);
    }

    @Query(() => Report, { nullable: true })
    @UseGuards(GqlAuthGuard)
    async reportByYear(
        @Args('companyId', { type: () => String }) companyId: string,
        @Args('year', { type: () => Number }) year: number,
        @Context() context: any,
    ) {
        const user = context.req.user;

        // Ensure user can only access their company's reports
        if (user.companyId !== companyId) {
            throw new ForbiddenException('Access denied');
        }

        return this.reportService.findByCompanyAndYear(companyId, year);
    }

    @Query(() => [Report])
    @UseGuards(GqlAuthGuard)
    async companyReports(@Context() context: any) {
        const user = context.req.user;
        return this.reportService.findByCompany(user.companyId);
    }

    @Query(() => Report, { nullable: true })
    @UseGuards(GqlAuthGuard)
    async latestReport(@Context() context: any) {
        const user = context.req.user;
        return this.reportService.getLatestByCompany(user.companyId);
    }
}
