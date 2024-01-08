import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssistantService } from './assistant.service';
import { OrchestratorModule } from 'src/orchestrator/orchestrator.module';

@Module({
  imports: [ConfigModule, OrchestratorModule],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
