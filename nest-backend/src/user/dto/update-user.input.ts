// src/user/dto/update-user.input.ts
import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(
    OmitType(User, ['id'], InputType),
) {}
