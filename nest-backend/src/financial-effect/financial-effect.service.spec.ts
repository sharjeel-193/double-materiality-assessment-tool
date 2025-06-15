import { Test, TestingModule } from '@nestjs/testing';
import { FinancialEffectService } from './financial-effect.service';

describe('FinancialEffectService', () => {
    let service: FinancialEffectService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FinancialEffectService],
        }).compile();

        service = module.get<FinancialEffectService>(FinancialEffectService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
