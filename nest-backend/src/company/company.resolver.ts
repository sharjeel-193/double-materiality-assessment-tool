import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CurrentCompanyResponse } from './dto/current-company.response';
import { CreateCompanyInput } from './dto/create-company.input';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver(() => Company)
export class CompanyResolver {
    constructor(private readonly companyService: CompanyService) {}

    @Mutation(() => Company)
    createCompany(
        @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
    ) {
        return this.companyService.create(createCompanyInput);
    }

    @Query(() => [Company], { name: 'companies' })
    findAll() {
        return this.companyService.findAll();
    }

    @Query(() => CurrentCompanyResponse, {
        name: 'company',
        description: 'Get Current Company for the user who is login',
    })
    @UseGuards(GqlAuthGuard)
    async getCurrentCompany(
        @Context() context: any,
    ): Promise<CurrentCompanyResponse> {
        const user = context.req.user;
        return this.companyService.getCurrentCompany(user.companyId);
    }
}
