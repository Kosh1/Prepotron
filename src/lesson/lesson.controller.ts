import { Body, Controller, Get, Param, Post, Query, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LessonService } from './lesson.service';
import { StartLessonDto } from './dto/start-lesson.dto';
import { CheckAnswerDto, CompleteProblemDto } from './dto/check-answer.dto';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { ChatRoomResponse, SSEQueryParams } from './interfaces/lesson.interface';
import { AnswerCheck } from 'src/entities/problem/interfaces/answerCheck.interface';
import { Observable } from 'rxjs';

@ApiTags('Lesson')
@Controller({
  path: 'lesson',
})
export class LessonController {
  constructor(private service: LessonService) {}

  @Get()
  appInfo() {
    return this.service.appInfo();
  }

  @Post()
  startLesson(@Body() { userId }: StartLessonDto) {
    return this.service.startLesson(userId);
  }

  @Sse('/stream/message')
  listenToChatMessages(@Query() sseQuery: SSEQueryParams): Observable<MessageEvent> {
    return this.service.observeChatMessageEvents(sseQuery);
  }

  @Post('/:id/message')
  sendChatMessage(
    @Param('id') lessonId: string,
    @Body() { userId, ...chatMessage }: SendChatMessageDto,
  ): Promise<ChatRoomResponse> {
    return this.service.sendUserMessage(userId, lessonId, chatMessage);
  }

  @Post('/:id/problem/:problemId/check')
  checkLessonProblem(
    @Param('id') lessonId: string,
    @Param('problemId') problemId: string,
    @Body() { userId, answer, shouldExplain }: CheckAnswerDto,
  ) {
    return this.service.checkSolution(userId, problemId, answer, { shouldExplain, lessonId });
  }

  @Post('/:id/proceed')
  completeProblem(@Param('id') lessonId: string, @Body() { userId, problemId }: CompleteProblemDto) {
    return this.service.completeProblem(userId, lessonId, problemId);
  }

  @Post('/problem/:id/check')
  checkSolution(@Param('id') problemId: string, @Body() { answer, userId }: CheckAnswerDto): Promise<AnswerCheck> {
    return this.service.checkSolution(userId, problemId, answer);
  }
}
