import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CheckAnswerDto {
  @ApiProperty({ example: '450 / (120 + x)' })
  @IsString()
  answer: string;

  @ApiProperty({ example: 'ID string' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'ID String' })
  problemId: string;

  @ApiProperty({ example: 'true' })
  @IsBoolean()
  shouldExplain?: boolean;
}

export class CompleteProblemDto {
  @ApiProperty({ example: 'ID String' })
  @IsNotEmpty()
  problemId: string;

  @ApiProperty({ example: 'ID String' })
  @IsNotEmpty()
  userId: string;
}
