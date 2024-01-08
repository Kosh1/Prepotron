import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as CustomSchema, Types } from 'mongoose';
import { ChatRoom } from 'src/entities/chatRoom/schemas/chatroom.schema';
import { User, UserSchema } from 'src/entities/user/entities/user.entity';

export type MessageDocument = HydratedDocument<Lesson>;

export const SettingsSchema = new CustomSchema({
  duration: { type: String, required: true },
  problemsTotal: { type: String, required: true },
  breakFrequency: { type: String, required: true },
});

export interface Settings {
  duration: number;
  problemsTotal: number;
  breakFrequency: number;
  fullExplanationTimeout: number;
}

export const TaskProblemSchema = new CustomSchema({
  id: { type: String, required: true },
  solutionStatus: { type: String, required: true, default: 'unsolved' },
  attempts: { type: Number, required: true, default: 0 },
  startedSolvingAt: { type: Date, required: false },
});

export interface TaskProblem {
  id: string;
  solutionStatus: 'solved' | 'unsolved';
  startedSolvingAt?: Date;
  attempts: number;
}

@Schema()
export class Lesson {
  @Prop({
    type: String,
    isRequired: true,
  })
  id: string;

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
    type: UserSchema,
    isRequired: true,
  })
  user: User;

  @Prop({
    type: String,
    isRequired: true,
  })
  topic: string;

  @Prop({
    type: [String],
    isRequired: true,
  })
  plan: Array<string>;

  @Prop({
    type: SettingsSchema,
    isRequired: true,
  })
  settings: Settings;

  @Prop({
    type: String,
    isRequired: true,
  })
  difficulty: string;

  @Prop({
    type: [TaskProblemSchema],
    isRequired: true,
  })
  problems: Array<TaskProblem>;

  @Prop({ type: Types.ObjectId, ref: ChatRoom.name, required: true })
  chatRoom: ChatRoom;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
