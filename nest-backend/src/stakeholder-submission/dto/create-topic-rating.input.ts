import { InputType, OmitType } from '@nestjs/graphql';
import { TopicRating } from '../entities/topic-rating.entity';

@InputType()
export class CreateTopicRatingInput extends OmitType(
    TopicRating,
    ['id'] as const,
    InputType,
) {
    // ✅ Inherits: submissionId, topicId, magnitude, relevance, score, ratingType
    // ✅ Excludes: id only
}
