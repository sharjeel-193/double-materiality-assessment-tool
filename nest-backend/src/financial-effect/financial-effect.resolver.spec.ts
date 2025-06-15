import { Test, TestingModule } from '@nestjs/testing';
import { FinancialEffectResolver } from './financial-effect.resolver';

describe('FinancialEffectResolver', () => {
    let resolver: FinancialEffectResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FinancialEffectResolver],
        }).compile();

        resolver = module.get<FinancialEffectResolver>(FinancialEffectResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
