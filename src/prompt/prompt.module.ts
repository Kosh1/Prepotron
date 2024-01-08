import { Module, forwardRef } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { LessonModule } from 'src/lesson/lesson.module';
import { ProblemModule } from 'src/entities/problem/problem.module';
import { UserModule } from 'src/entities/user/user.module';

@Module({
  imports: [forwardRef(() => LessonModule), ProblemModule, UserModule],
  providers: [PromptService],
  exports: [PromptService],
})
export class PromptModule {}
