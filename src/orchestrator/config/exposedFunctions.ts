import { ChatCompletionCreateParams } from 'openai/resources/chat/completions';
import { ExposedFunctionName } from '../interfaces/functions.interface';

export const exposedFunctions: Array<ChatCompletionCreateParams.Function> = [
  {
    name: ExposedFunctionName.getProblem,
    description: `Get a math problem relevant to the ongoing lesson`,
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];
