import { Test, TestingModule } from '@nestjs/testing';
import { StakeholderService } from './stakeholder.service';

describe('StakeholderService', () => {
    let service: StakeholderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StakeholderService],
        }).compile();

        service = module.get<StakeholderService>(StakeholderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
