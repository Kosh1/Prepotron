import { Lesson } from 'src/entities/lessonEntity/schemas/lesson.schema';
import { AnswerCheck } from 'src/entities/problem/interfaces/answerCheck.interface';
import { ClientProblem } from '../../entities/problem/interfaces/clientProblem.interface';
import { ValidatedChatMessage } from '../../assistant/interfaces/assistant.interface';
import { SendChatMessageDto } from '../dto/send-chat-message.dto';

export interface ProblemSolution {
  subject: string;
  description: string;
  id: string;
}

export interface ChatRoomResponse {
  lesson: Lesson;
  response: ValidatedChatMessage;
  problem: ClientProblem | null;
}

export type ProblemResponse = Omit<ChatRoomResponse, 'lesson' | 'response'>;

export interface AnswerCheckResponse extends AnswerCheck {
  response?: ValidatedChatMessage;
}

export interface SSEQueryParams {
  userId: string;
}

export type UserMessage = Omit<SendChatMessageDto, 'userId'>;
