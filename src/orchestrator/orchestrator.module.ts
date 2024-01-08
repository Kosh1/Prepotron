import { Module, forwardRef } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { LessonModule } from 'src/lesson/lesson.module';

@Module({
  imports: [forwardRef(() => LessonModule)],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}
