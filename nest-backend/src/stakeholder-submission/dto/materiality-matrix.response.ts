import { ObjectType, Field } from '@nestjs/graphql';
import { MaterialityMatrixItem } from '../entities/materiality-matrix.entity';

@ObjectType()
export class MaterialityMatrixResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [MaterialityMatrixItem])
    data: MaterialityMatrixItem[];
}
