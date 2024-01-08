import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProblemExtra, ProblemExtraSchema } from './problemExtra.interface';

@Schema()
export class AnswerOption {
  @Prop({ type: String, isRequired: true })
  id: string;

  @Prop({ type: String, isRequired: true })
  description: string;

  @Prop({ type: String, isRequired: true })
  explanation: string;

  @Prop({
    type: ProblemExtraSchema,
  })
  extra: ProblemExtra;
}

export const AnswerOptionSchema = SchemaFactory.createForClass(AnswerOption);
