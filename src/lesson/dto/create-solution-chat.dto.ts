import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSolutionChatDto {
  @ApiProperty({ example: '01H6BXNECJ7XADG75BCC7SQ6BN' })
  @IsNotEmpty()
  problemId: string;
}
