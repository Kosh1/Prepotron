import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ProblemExtraSchema {
  @Prop({ type: String, isRequired: true })
  type: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: [Number] })
  points: Array<[number, number]>;
}

export type ChartExtra = { type: 'chart'; points: Array<[number, number]> };
export type FigureExtra = { type: 'figure'; code: string };
export type ProblemExtra = ChartExtra | FigureExtra | null;
