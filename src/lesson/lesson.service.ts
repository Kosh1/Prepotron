import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { AssistantService } from 'src/assistant/assistant.service';
import { AllConfigType } from 'src/config/config.type';
import { toChatAssistantMessages } from 'src/assistant/utils/adapters';
import { ProblemService } from 'src/entities/problem/problem.service';
import { ChatRoomService } from 'src/entities/chatRoom/chatRoom.service';
import { PromptService } from 'src/prompt/prompt.service';
import { PromptRequest, PromptType, PromptVariables } from 'src/prompt/interfaces/prompt.interface';
import { Problem } from 'src/entities/problem/schemas/problem.schema';
import { UserService } from 'src/entities/user/user.service';
import { LessonEntityService } from 'src/entities/lessonEntity/lessonEntity.service';
import {
  ChatMessageEvent,
  ValidatedChatMessage,
  isChatFunctionCompletionResponse,
} from 'src/assistant/interfaces/assistant.interface';
import { Lesson } from 'src/entities/lessonEntity/schemas/lesson.schema';
import {
  AnswerCheckResponse,
  ChatRoomResponse,
  ProblemResponse,
  SSEQueryParams,
  UserMessage,
} from './interfaces/lesson.interface';
import { isNMinutesAgo } from 'src/utils/date-compare';
import { toClient } from '../entities/problem/utils/toClient';

@Injectable()
export class LessonService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private assistantService: AssistantService,
    private problemService: ProblemService,
    private chatRoomService: ChatRoomService,
    private promptService: PromptService,
    private userService: UserService,
    private lessonEntityService: LessonEntityService,
  ) {}

  private chatMessageEventEmitter: EventEmitter2 = new EventEmitter2();
  private ESCALATION_TIME = 5;

  appInfo() {
    return { name: this.configService.get('app.name', { infer: true }), version: '0.1.0' };
  }

  async startLesson(userId: string): Promise<ChatRoomResponse> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const chatRoom = await this.chatRoomService.create();
    const lesson = await this.lessonEntityService.create(user, chatRoom);
    const { system: systemPropmt, user: userMessage } = this.promptService.getTeacherPrompt({ lesson, user });
    if (!userMessage) throw new Error('No initial message found in prompt');

    const chatHistory = toChatAssistantMessages([systemPropmt, userMessage]);
    const { response } = await this.assistantService.prompt(chatHistory, userId, this.chatMessageEventEmitter);
    chatHistory.push(response);

    chatRoom.messages = chatHistory;
    await this.chatRoomService.update(chatRoom.id, chatRoom);

    return {
      response,
      lesson,
      problem: null,
    };
  }

  observeChatMessageEvents(sseQuery: SSEQueryParams): Observable<any> {
    if (!sseQuery.userId) throw new BadRequestException('userId required');

    return fromEvent(this.chatMessageEventEmitter, 'new-message').pipe(
      map((event: ChatMessageEvent) => {
        if (event.recipientId !== sseQuery.userId) return;

        return { data: { type: 'new-message', ...event } };
      }),
    );
  }

  async sendUserMessage(userId: string, lessonId: string, { message, shouldEscalate }: UserMessage) {
    const lesson = await this.lessonEntityService.findOne(lessonId);
    if (!lesson || !lesson?.chatRoom) {
      throw new NotFoundException('Could not find lesson and relevant chatroom');
    }
    const promptRequest = await this.getRelevantExplainPrompt(lesson, shouldEscalate);

    return this.sendChatMessage(userId, lesson, message, promptRequest);
  }

  private async getRelevantExplainPrompt(lesson: Lesson, shouldEscalate): Promise<PromptRequest | undefined> {
    let promptRequest: PromptRequest | undefined = undefined;
    if (lesson.chatRoom.prompt !== PromptType.Explain) return promptRequest;

    const currentSolvedProblem = LessonEntityService.findUnsolvedProblem(lesson);
    if (!currentSolvedProblem) throw new NotFoundException('Could not find problem user is solving');

    const problem = await this.problemService.getProblem(currentSolvedProblem.id);
    promptRequest = { promptType: PromptType.Explain, promptVariables: { problem } };

    const shouldStartEscalating = currentSolvedProblem?.startedSolvingAt
      ? isNMinutesAgo(currentSolvedProblem?.startedSolvingAt, this.ESCALATION_TIME)
      : shouldEscalate;

    if (shouldStartEscalating) {
      promptRequest.promptType = PromptType.Escalate;
    }

    return promptRequest;
  }

  private async sendChatMessage(
    userId: string,
    lesson: Lesson,
    message: string,
    promptRequest?: PromptRequest,
  ): Promise<ChatRoomResponse> {
    let chatRoom = lesson.chatRoom;

    if (promptRequest?.promptType) {
      const newSystemPrompt = await this.promptService.getInitialPrompt(promptRequest.promptType, {
        ...promptRequest?.promptVariables,
        lesson,
      });
      chatRoom = ChatRoomService.changeInitialPrompt(chatRoom, newSystemPrompt, promptRequest.promptType);
    }

    chatRoom = ChatRoomService.addUserMessage(chatRoom, message);
    const { response } = await this.assistantService.prompt(
      toChatAssistantMessages(chatRoom.messages),
      userId,
      this.chatMessageEventEmitter,
    );

    const problem = await this.getProblem(response, lesson);

    if (problem) {
      const newSystemPrompt = await this.promptService.getInitialPrompt(PromptType.Explain, { problem });
      chatRoom = ChatRoomService.changeInitialPrompt(chatRoom, newSystemPrompt, PromptType.Explain);
    }

    chatRoom = ChatRoomService.addResponseMessage(chatRoom, response);
    await this.chatRoomService.update(chatRoom.id, chatRoom);

    return {
      response: response,
      lesson,
      problem: toClient(problem),
    };
  }

  async getProblem(response: ValidatedChatMessage, lesson: Lesson): Promise<Problem | null> {
    if (isChatFunctionCompletionResponse(response)) {
      if (response.function_call.name === 'getProblem') {
        const problemToSolve = lesson.problems.find((p) => p.solutionStatus == 'unsolved');

        if (!problemToSolve) {
          console.log('No unsolved problems in the lesson, but assistant tried to get one. Returning default.');
          return null;
        }

        const problem = await this.problemService.getProblem(problemToSolve.id);
        await this.lessonEntityService.setSolvingProblem(lesson, problem.id);
        return problem;
      }
    }

    return null;
  }

  async completeProblem(
    userId: string,
    lessonId: string,
    problemId: string,
  ): Promise<ChatRoomResponse | ProblemResponse> {
    const lesson = await this.lessonEntityService.findOne(lessonId);

    if (!lesson) {
      throw new NotFoundException('Lesson not found, lessonId:', lessonId);
    }

    lesson.problems.forEach((p) => {
      if (p.id === problemId) {
        p.solutionStatus = 'solved';
      }
    });

    await this.lessonEntityService.update(lesson.id, lesson);

    const problemToSolve = LessonEntityService.findUnsolvedProblem(lesson);

    if (!problemToSolve) {
      return this.finishLesson(userId, lesson);
    }

    const problem = await this.problemService.getProblem(problemToSolve.id);

    return {
      problem,
    };
  }

  private async finishLesson(userId: string, lesson: Lesson): Promise<ChatRoomResponse> {
    const userMessage = this.promptService.getUserFinishRequest();
    const promptVariables: PromptVariables = { lesson, userId };
    return this.sendChatMessage(userId, lesson, userMessage, { promptType: PromptType.Finish, promptVariables });
  }

  async checkSolution(
    userId: string,
    problemId: string,
    userAnswer: string,
    options?: { shouldExplain?: boolean; lessonId: string },
  ): Promise<AnswerCheckResponse> {
    const answerCheck: AnswerCheckResponse = await this.problemService.compareAnswer(userAnswer, problemId);

    if (options?.shouldExplain && !answerCheck.isCorrect) {
      const explanationRequest = await this.problemService.getExplanationRequest(userAnswer, problemId);
      const userMessage = this.promptService.getUserExplanationRequest(explanationRequest);
      const lesson = await this.lessonEntityService.findOne(options.lessonId);
      if (!lesson) {
        throw new NotFoundException('Lesson not found, lessonId:', options.lessonId);
      }

      const chatResponse = await this.sendChatMessage(userId, lesson, userMessage);

      answerCheck.response = chatResponse.response;
    }

    return answerCheck;
  }
}
