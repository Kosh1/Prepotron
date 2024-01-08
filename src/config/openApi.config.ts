import { registerAs } from '@nestjs/config';
import { OpenApiConfig } from './config.type';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  OPENAI_API_KEY: string;
}

export default registerAs<OpenApiConfig>('openApi', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    key: process.env.OPENAI_API_KEY,
  };
});
