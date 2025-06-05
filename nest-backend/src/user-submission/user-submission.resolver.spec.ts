import { Test, TestingModule } from '@nestjs/testing';
import { UserSubmissionResolver } from './user-submission.resolver';
import { SubmissionType } from '../common/enums';
import { CreateUserSubmissionInput } from './dto/create-user-submission.input';
import { UserSubmissionService } from './user-submission.service';

describe('UserSubmissionResolver', () => {
    let resolver: UserSubmissionResolver;
    let service: UserSubmissionService;

    const mockUserId = 'user-123';
    const mockSubmissionId = 'submission-123';
    const mockStakeholderId1 = 'stakeholder-1';
    const mockStakeholderId2 = 'stakeholder-2';

    const mockStakeholderRating1 = {
        id: 'rating-1',
        submissionId: mockSubmissionId,
        stakeholderId: mockStakeholderId1,
        influence: 8.5,
        impact: 7.0,
        score: 7.75,
        stakeholder: {
            id: mockStakeholderId1,
            name: 'Local Community',
            description: 'Local community stakeholders',
            activityId: 'activity-1',
            avgInfluence: 8.5,
            avgImpact: 7.0,
        },
    };

    const mockStakeholderRating2 = {
        id: 'rating-2',
        submissionId: mockSubmissionId,
        stakeholderId: mockStakeholderId2,
        influence: 6.0,
        impact: 9.0,
        score: 7.5,
        stakeholder: {
            id: mockStakeholderId2,
            name: 'Investors',
            description: 'Investment stakeholders',
            activityId: 'activity-2',
            avgInfluence: 6.0,
            avgImpact: 9.0,
        },
    };

    const mockUser = {
        id: mockUserId,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password', // In real app, this would be hashed
        role: 'TEAM_MEMBER' as const, // or use UserRole enum
        companyId: 'company-123',
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2025-01-01'),
    };

    const mockUserSubmission = {
        id: mockSubmissionId,
        userId: mockUserId,
        stakeholderId: null,
        type: SubmissionType.INTERNAL,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        user: mockUser,
        stakeholder: null,
        stakeholderRatings: [mockStakeholderRating1, mockStakeholderRating2],
    };

    const mockCreateInput: CreateUserSubmissionInput = {
        userId: mockUserId,
        type: SubmissionType.INTERNAL,
        stakeholderRatings: [
            {
                stakeholderId: mockStakeholderId1,
                influence: 8.5,
                impact: 7.0,
                score: 7.75,
                submissionId: mockSubmissionId,
            },
            {
                stakeholderId: mockStakeholderId2,
                influence: 6.0,
                impact: 9.0,
                submissionId: mockSubmissionId,
            },
        ],
    };

    const mockServiceResponse = {
        success: true,
        message: 'Operation successful',
        data: mockUserSubmission,
    };

    beforeEach(async () => {
        const mockUserSubmissionService = {
            create: jest.fn(),
            findByUser: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserSubmissionResolver,
                {
                    provide: UserSubmissionService,
                    useValue: mockUserSubmissionService,
                },
            ],
        }).compile();

        resolver = module.get<UserSubmissionResolver>(UserSubmissionResolver);
        service = module.get<UserSubmissionService>(UserSubmissionService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('createUserSubmission', () => {
        it('should create a user submission successfully', async () => {
            // Arrange
            const expectedResponse = {
                ...mockServiceResponse,
                message:
                    'User submission created successfully with 2 stakeholder rating(s)',
            };
            const createSpy = jest
                .spyOn(service, 'create')
                .mockResolvedValue(expectedResponse);

            // Act
            const result = await resolver.createUserSubmission(mockCreateInput);

            // Assert
            expect(createSpy).toHaveBeenCalledWith(mockCreateInput);
            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUserSubmission);
            expect(result).toEqual(mockUserSubmission);
            expect(result?.stakeholderRatings).toHaveLength(2);
            expect(result?.stakeholderRatings[0].influence).toBe(8.5);
            expect(result?.stakeholderRatings[1].impact).toBe(9.0);
        });
    });
});
