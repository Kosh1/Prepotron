import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FunctionCall {
  @Prop({
    type: String,
  })
  name?: string;

  @Prop({
    type: String,
  })
  arguments?: string;
}
export const FunctionCallSchema = SchemaFactory.createForClass(FunctionCall);
