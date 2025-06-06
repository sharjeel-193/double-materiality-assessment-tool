import { InputType, OmitType } from '@nestjs/graphql';
import { TopicRating } from '../entities/topic-rating.entity';

@InputType()
export class CreateTopicRatingInput extends OmitType(
    TopicRating,
    ['id', 'submissionId', 'topic'] as const,
    InputType,
) {
    // ✅ Inherits: topicId, magnitude, relevance, score, ratingType
    // ✅ Excludes: id only
}
