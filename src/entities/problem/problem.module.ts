import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProblemSchema, Problem } from './schemas/problem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Problem.name,
        schema: ProblemSchema,
      },
    ]),
  ],
  providers: [ProblemService],
  exports: [ProblemService],
})
export class ProblemModule {}
