import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CreateCompanyInput } from './dto/create-company.input';

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

    @Query(() => Company, { name: 'company' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.companyService.findOne(id);
    }
}
