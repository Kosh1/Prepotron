import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PromptType,
  ProblemPromptVairables,
  TeacherPromptVairables,
  PromptVariables,
  InitialPrompt,
  UserWrongAnswer,
} from './interfaces/prompt.interface';
import {
  getLessonPrompt,
  getExplainPrompt,
  getEscalatePrompt,
  userExplanationRequest,
  getLessonFinisherPrompt,
  getLessonFinishRequest,
} from './config/initialPrompts';
import { ProblemService } from 'src/entities/problem/problem.service';
import { UserService } from 'src/entities/user/user.service';

@Injectable()
export class PromptService {
  constructor(
    private problemService: ProblemService,
    private userService: UserService,
  ) {}

  getTeacherPrompt(options: TeacherPromptVairables) {
    return getLessonPrompt(options);
  }

  private getProblemPrompt(type: PromptType, options: ProblemPromptVairables) {
    if (type === PromptType.Explain) return getExplainPrompt(options);
    if (type === PromptType.Escalate) return getEscalatePrompt(options);

    return getExplainPrompt(options);
  }

  private getFinisherPrompt(options: TeacherPromptVairables) {
    return getLessonFinisherPrompt(options);
  }

  getUserFinishRequest() {
    return getLessonFinishRequest();
  }

  getUserExplanationRequest(answer: UserWrongAnswer) {
    return userExplanationRequest(answer);
  }

  async getInitialPrompt(targetPrompt: PromptType, promptVariables?: PromptVariables): Promise<InitialPrompt | null> {
    let newSystemPrompt: InitialPrompt | null = null;
    // TODO: Add stricter typing to match each type with its variables
    if (targetPrompt === PromptType.Finish) {
      const lesson = await this.getLesson(promptVariables);
      const user = await this.getUser(promptVariables);
      newSystemPrompt = this.getFinisherPrompt({ lesson, user });
    }

    if (targetPrompt === PromptType.Explain) {
      if (!promptVariables?.problem) throw new Error('Problem is required');
      newSystemPrompt = this.getProblemPrompt(PromptType.Explain, promptVariables.problem);
    }

    if (targetPrompt === PromptType.Escalate) {
      if (!promptVariables?.problem) throw new Error('Problem is required');
      newSystemPrompt = this.getProblemPrompt(PromptType.Escalate, promptVariables.problem);
    }

    return newSystemPrompt;
  }

  private async getLesson(promptVariables?: PromptVariables) {
    if (!promptVariables?.lesson) throw new Error('lesson is required for finish prompt');

    return Promise.resolve(promptVariables.lesson);
  }

  private async getUser(promptVariables?: PromptVariables) {
    if (!promptVariables?.userId) throw new Error('userId is required for finish prompt');

    const user = await this.userService.findOne(promptVariables.userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
