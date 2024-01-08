import { ValidatedChatMessage } from 'src/assistant/interfaces/assistant.interface';
import { Lesson } from 'src/entities/lessonEntity/schemas/lesson.schema';
import { Problem } from 'src/entities/problem/schemas/problem.schema';
import { User } from 'src/entities/user/entities/user.entity';

export enum PromptType {
  Teacher = 'teacher',
  Explain = 'explain',
  Escalate = 'escalate',
  Finish = 'finish',
}

export type ProblemPromptVairables = Pick<Problem, 'description'>;
export type TeacherPromptVairables = { user: User; lesson: Lesson };

export interface UserWrongAnswer {
  explanation: string;
  userAnswer: string;
  description: string;
}

export interface InitialPrompt {
  system: ValidatedChatMessage;
  assistant?: ValidatedChatMessage;
  user?: ValidatedChatMessage;
}

export interface PromptVariables {
  lessonId?: string;
  userId?: string;
  lesson?: Lesson;
  problem?: Problem;
  user?: User;
}

export interface PromptRequest {
  promptVariables: PromptVariables;
  promptType: PromptType;
}
