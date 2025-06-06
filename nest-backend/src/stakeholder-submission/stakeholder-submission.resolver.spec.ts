import { Test, TestingModule } from '@nestjs/testing';
import { StakeholderSubmissionResolver } from './stakeholder-submission.resolver';

describe('StakeholderSubmissionResolver', () => {
    let resolver: StakeholderSubmissionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StakeholderSubmissionResolver],
        }).compile();

        resolver = module.get<StakeholderSubmissionResolver>(
            StakeholderSubmissionResolver,
        );
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
