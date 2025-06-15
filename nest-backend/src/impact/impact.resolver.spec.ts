import { Test, TestingModule } from '@nestjs/testing';
import { ImpactResolver } from './impact.resolver';

describe('ImpactResolver', () => {
    let resolver: ImpactResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImpactResolver],
        }).compile();

        resolver = module.get<ImpactResolver>(ImpactResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
