import { Message } from 'src/entities/message/schemas/message.schema';
import { ChatHistory, ValidatedChatMessage } from '../interfaces/assistant.interface';
import { dummyMessage } from '../config/dialog';
import { ChatCompletionMessage } from 'openai/resources/chat';

export const toUserMessage = (message: string): ValidatedChatMessage => {
  return { role: 'user', content: message };
};

export const toChatAssistantMessages = (messages: Array<Message>): ChatHistory => {
  return messages.map((message) => ({ role: message.role, content: message.content || '', name: message.name }));
};

export const validateResponse = (message?: ChatCompletionMessage): ValidatedChatMessage => {
  if (!message) {
    return dummyMessage;
  }

  return { ...message, content: message.content || '' };
};
