// context/context.resolver.ts
import {
    Resolver,
    Query,
    Mutation,
    Args,
    Context as GqlContext,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContextService } from './context.service';
import { Context } from './entities/context.enitity';
import { CreateContextInput } from './dto/create-context.input';
import { UpdateContextInput } from './dto/update-context.input';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver(() => Context)
export class ContextResolver {
    constructor(private readonly contextService: ContextService) {}

    @Mutation(() => Context)
    @UseGuards(GqlAuthGuard)
    async createContext(
        @Args('createContextInput') createContextInput: CreateContextInput,
    ) {
        return this.contextService.create(createContextInput);
    }

    @Query(() => [Context])
    @UseGuards(GqlAuthGuard)
    async contexts(@GqlContext() context: any) {
        const user = context.req.user;
        return this.contextService.findByCompany(user.companyId);
    }

    @Query(() => Context, { nullable: true })
    @UseGuards(GqlAuthGuard)
    async contextByReport(
        @Args('reportId', { type: () => String }) reportId: string,
    ) {
        return this.contextService.findByReport(reportId);
    }

    @Query(() => Context)
    @UseGuards(GqlAuthGuard)
    async context(@Args('id', { type: () => String }) id: string) {
        return this.contextService.findOne(id);
    }

    @Mutation(() => Context)
    @UseGuards(GqlAuthGuard)
    async updateContext(
        @Args('id', { type: () => String }) id: string,
        @Args('updateContextInput') updateContextInput: UpdateContextInput,
    ) {
        return this.contextService.update(id, updateContextInput);
    }

    @Mutation(() => Context)
    @UseGuards(GqlAuthGuard)
    async removeContext(@Args('id', { type: () => String }) id: string) {
        return this.contextService.remove(id);
    }
}
