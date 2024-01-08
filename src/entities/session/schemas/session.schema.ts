import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message, MessageSchema } from 'src/entities/message/schemas/message.schema';
import { User } from 'src/entities/user/entities/user.entity';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop({ type: String, required: true })
  id: string;

  @Prop()
  user: User;

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

export const SessionSchema = SchemaFactory.createForClass(Session);
