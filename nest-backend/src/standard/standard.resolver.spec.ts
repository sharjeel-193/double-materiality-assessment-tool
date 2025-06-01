import { Test, TestingModule } from '@nestjs/testing';
import { StandardResolver } from './standard.resolver';

describe('StandardResolver', () => {
    let resolver: StandardResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StandardResolver],
        }).compile();

        resolver = module.get<StandardResolver>(StandardResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
