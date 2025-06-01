import { Test, TestingModule } from '@nestjs/testing';
import { DimensionResolver } from './dimension.resolver';

describe('DimensionResolver', () => {
    let resolver: DimensionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DimensionResolver],
        }).compile();

        resolver = module.get<DimensionResolver>(DimensionResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
