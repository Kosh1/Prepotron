import { ChatCompletionMessage, ChatCompletionMessageParam } from 'openai/resources/chat';

export interface ChatFunctionCompletionResponse extends ChatCompletionMessage {
  content: string;
  function_call: ChatCompletionMessage.FunctionCall;
}

export const isChatFunctionCompletionResponse = (
  message: ChatCompletionMessage,
): message is ChatFunctionCompletionResponse => {
  return !!message.function_call;
};

export interface ValidatedChatMessage extends ChatCompletionMessageParam {
  content: string;
}

export type ChatHistory = Array<ValidatedChatMessage>;

export type ChatMessageEvent = { content: string; recipientId: string; isInitial?: boolean };
