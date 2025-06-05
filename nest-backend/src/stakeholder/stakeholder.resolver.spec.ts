import { Test, TestingModule } from '@nestjs/testing';
import { StakeholderResolver } from './stakeholder.resolver';

describe('StakeholderResolver', () => {
    let resolver: StakeholderResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StakeholderResolver],
        }).compile();

        resolver = module.get<StakeholderResolver>(StakeholderResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
