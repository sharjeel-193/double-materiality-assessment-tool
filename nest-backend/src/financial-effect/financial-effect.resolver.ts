import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FinancialEffectService } from './financial-effect.service';
import { FinancialEffect } from './entities/financial-effect.entity';
import { CreateFinancialEffectInput } from './dto/create-financial-effect.input';
import { UpdateFinancialEffectInput } from './dto/update-financial-effect.input';
import {
    FinancialEffectResponse,
    FinancialEffectsResponse,
} from './dto/financial-effect.reponse';
import { FinancialEffectType } from '../common/enums';

@Resolver(() => FinancialEffect)
export class FinancialEffectResolver {
    constructor(
        private readonly financialEffectService: FinancialEffectService,
    ) {}

    @Mutation(() => FinancialEffectResponse, { name: 'createFinancialEffect' })
    createFinancialEffect(
        @Args('createFinancialEffectInput')
        createFinancialEffectInput: CreateFinancialEffectInput,
    ) {
        return this.financialEffectService.create(createFinancialEffectInput);
    }

    @Query(() => FinancialEffectsResponse, { name: 'financialEffectsByReport' })
    findFinancialEffectsByReport(
        @Args('reportId', { type: () => ID }) reportId: string,
    ) {
        return this.financialEffectService.findByReport(reportId);
    }

    @Query(() => FinancialEffectsResponse, {
        name: 'financialEffectsByReportAndType',
    })
    findFinancialEffectsByReportAndType(
        @Args('reportId', { type: () => ID }) reportId: string,
        @Args('type', { type: () => FinancialEffectType })
        type: FinancialEffectType,
    ) {
        return this.financialEffectService.findByReportAndType(reportId, type);
    }

    @Query(() => FinancialEffectResponse, { name: 'financialEffect' })
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.financialEffectService.findOne(id);
    }

    @Mutation(() => FinancialEffectResponse, { name: 'updateFinancialEffect' })
    updateFinancialEffect(
        @Args('id', { type: () => ID }) id: string,
        @Args('updateFinancialEffectInput')
        updateFinancialEffectInput: UpdateFinancialEffectInput,
    ) {
        return this.financialEffectService.update(
            id,
            updateFinancialEffectInput,
        );
    }

    @Mutation(() => FinancialEffectResponse, { name: 'removeFinancialEffect' })
    removeFinancialEffect(@Args('id', { type: () => ID }) id: string) {
        return this.financialEffectService.remove(id);
    }
}
