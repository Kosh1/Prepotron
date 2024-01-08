import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as Sentry from '@sentry/node';

import { exposedFunctions } from '../orchestrator/config/exposedFunctions';
import { OrchestratorService } from 'src/orchestrator/orchestrator.service';
import { ChatHistory, ChatMessageEvent, ValidatedChatMessage } from './interfaces/assistant.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { Stream } from 'openai/streaming';

const MODEL = 'gpt-4';

@Injectable()
export class AssistantService {
  private readonly assistant: OpenAI;
  constructor(private readonly orchestratorService: OrchestratorService) {
    this.assistant = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async prompt(
    chatHistory: ChatHistory,
    recipient: string,
    eventEmitter?: EventEmitter2,
  ): Promise<{
    response: ValidatedChatMessage;
  }> {
    console.log('>>STARTING PROMPT');

    try {
      const stream = await this.assistant.chat.completions.create({
        model: MODEL,
        functions: exposedFunctions,
        messages: chatHistory,
        stream: true,
      });

      const response = await this.processMessageChunkStream(stream, recipient, eventEmitter);

      return { response };
    } catch (error) {
      if (error.response) {
        Sentry.captureException(error);
        throw new InternalServerErrorException();
      } else {
        Sentry.captureException(`Error with OpenAI API request: ${error.message}`);
        throw new InternalServerErrorException();
      }
    }
  }

  private async processMessageChunkStream(
    stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
    recipientId: string,
    eventEmitter?: EventEmitter2,
  ) {
    const response: ValidatedChatMessage = { content: '', role: 'assistant' };
    let initMessageSent = false;

    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content || '';
      response.content += content;

      const functionCall = part.choices[0]?.delta?.function_call;
      if (functionCall && functionCall.name) {
        response.function_call = functionCall as ChatCompletionMessageParam.FunctionCall;
      }

      if (!initMessageSent && !response.function_call) {
        eventEmitter?.emit('new-message', { content: '', recipientId, isInitial: true } satisfies ChatMessageEvent);
        initMessageSent = true;
      }

      eventEmitter?.emit('new-message', { content, recipientId } satisfies ChatMessageEvent);
    }

    return response;
  }
}
