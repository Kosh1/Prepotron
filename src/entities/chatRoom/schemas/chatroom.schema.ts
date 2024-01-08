import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message, MessageSchema } from 'src/entities/message/schemas/message.schema';
import { PromptType } from 'src/prompt/interfaces/prompt.interface';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({
    type: String,
    enum: [PromptType.Teacher, PromptType.Explain, PromptType.Escalate],
    required: true,
    default: PromptType.Teacher,
  })
  prompt: PromptType;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    required: false,
  })
  updatedAt?: Date;

  @Prop({
    type: [MessageSchema],
  })
  messages: Message[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
