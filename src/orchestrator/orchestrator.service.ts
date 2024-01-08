import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as Sentry from '@sentry/node';

import { LessonService } from 'src/lesson/lesson.service';
import { ChatFunctionCompletionResponse, ValidatedChatMessage } from 'src/assistant/interfaces/assistant.interface';
import { isExposedFunctionName } from './interfaces/functions.interface';

@Injectable()
export class OrchestratorService {
  constructor(
    @Inject(forwardRef(() => LessonService))
    private readonly lessonService: LessonService,
  ) {}

  private FUNCTION_NOT_FOUND = 'Function not found';

  async process(message: ChatFunctionCompletionResponse): Promise<ValidatedChatMessage> {
    const response: ValidatedChatMessage = {
      role: 'function',
      name: message.function_call.name,
      content: this.FUNCTION_NOT_FOUND,
    };

    try {
      const result = await this.callExposedFunction(message);
      if (result) {
        response.content = JSON.stringify(result);
      }
    } catch (error) {
      console.log('Failed to call exposed function', error);
    }

    return response;
  }

  private async callExposedFunction(message: ValidatedChatMessage) {
    const functionName = message.function_call?.name;
    const functionArgs = message.function_call?.arguments;
    if (isExposedFunctionName(functionName)) {
      const functionToCall = this.functionsMap[functionName];
      if (functionToCall) {
        const response = await functionToCall(JSON.parse(functionArgs || ''));

        return response;
      }
    }

    Sentry.captureException(`DID NOT FIND THE FUNCTION ${functionName}`);
    throw new Error(`Function ${functionName} not found`);
  }

  private functionsMap = {};
}
