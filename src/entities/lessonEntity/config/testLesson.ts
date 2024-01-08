import { problems } from '../../problem/config/problems';

function shuffleArray<T>(array: Array<T>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

const totalIds = shuffleArray(problems.map((p) => ({ id: p.id })));

export const testLesson = {
  id: '01F9YF3Y1Y3YQZJXZJZJZJZJZJ',
  studentId: 'test-student-id',
  topic: 'Mathematics',
  plan: ['Preparing for the ACT math exam'],
  settings: {
    duration: 10,
    problemsTotal: 1,
    breakFrequency: 0,
    fullExplanationTimeout: 3,
  },
  difficulty: 'medium',
  problems: totalIds,
};
