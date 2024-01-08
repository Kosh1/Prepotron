import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FunctionCall, FunctionCallSchema } from './functionCall.schema';
import { ChatCompletionRole } from 'openai/resources/chat';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({
    type: String,
    enum: ['system', 'user', 'assistant', 'function'],
    isRequired: true,
  })
  role: ChatCompletionRole;

  @Prop({
    type: String,
    default: '',
  })
  content?: string;

  @Prop({
    type: String,
    isRequired: false,
  })
  name?: string;

  @Prop({
    type: [FunctionCallSchema],
    isRequired: false,
  })
  function_call?: FunctionCall;

  constructor(role: ChatCompletionRole, content?: string, name?: string) {
    this.role = role;
    if (content) this.content = content;
    if (name) this.name = name;
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message);
