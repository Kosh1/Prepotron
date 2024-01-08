import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { ConfigModule } from '@nestjs/config';
import { AssistantModule } from 'src/assistant/assistant.module';
import { SessionModule } from 'src/entities/session/session.module';
import { MessageModule } from 'src/entities/message/message.module';
import { ProblemModule } from 'src/entities/problem/problem.module';
import { ChatRoomModule } from 'src/entities/chatRoom/chatRoom.module';
import { PromptModule } from 'src/prompt/prompt.module';
import { UserModule } from 'src/entities/user/user.module';
import { LessonEntityModule } from 'src/entities/lessonEntity/lessonEntity.module';

@Module({
  imports: [
    ConfigModule,
    AssistantModule,
    SessionModule,
    MessageModule,
    ProblemModule,
    ChatRoomModule,
    PromptModule,
    UserModule,
    LessonEntityModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
