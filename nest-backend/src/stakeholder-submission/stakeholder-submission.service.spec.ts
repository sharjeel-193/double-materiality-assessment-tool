import { Test, TestingModule } from '@nestjs/testing';
import { StakeholderSubmissionService } from './stakeholder-submission.service';

describe('StakeholderSubmissionService', () => {
    let service: StakeholderSubmissionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StakeholderSubmissionService],
        }).compile();

        service = module.get<StakeholderSubmissionService>(
            StakeholderSubmissionService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
