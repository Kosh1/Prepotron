import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendChatMessageDto {
  @ApiProperty({ example: 'ID string' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Hello, here is my question...' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ example: 'true' })
  @IsBoolean()
  @IsOptional()
  shouldEscalate: boolean;
}
