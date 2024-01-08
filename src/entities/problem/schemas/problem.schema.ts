import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Solution, SolutionSchema } from 'src/entities/problem/schemas/solution.schema';
import { ProblemExtra, ProblemExtraSchema } from '../interfaces/problemExtra.interface';

export type ProblemDocument = HydratedDocument<Problem>;

@Schema()
export class Problem {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: ProblemExtraSchema,
  })
  extra: ProblemExtra;

  @Prop({
    type: [SolutionSchema],
  })
  solution: Solution;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt?: Date;

  @Prop({
    type: Date,
    required: false,
  })
  updatedAt?: Date;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
