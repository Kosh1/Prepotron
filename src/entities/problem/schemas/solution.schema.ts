import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AnswerOptionSchema, AnswerOption } from '../interfaces/answerOption.interface';

export type MessageDocument = HydratedDocument<Solution>;

@Schema()
export class Solution {
  @Prop({
    type: [String],
    isRequired: true,
  })
  correctOptions: Array<string>;

  @Prop({
    type: [AnswerOptionSchema],
    isRequired: true,
  })
  options: Array<AnswerOption>;
}

export const SolutionSchema = SchemaFactory.createForClass(Solution);
