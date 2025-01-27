import { z } from 'zod';

const TimeTaskSchema = z.object({
  criteria: z.literal('time'),
  title: z.string(),
  description: z.string(),
  totalTime: z.number(),
  spentTime: z.number(),
  done: z.boolean(),
});

const CountTaskSchema = z.object({
  criteria: z.literal('count'),
  title: z.string(),
  description: z.string(),
  totalCount: z.number(),
  doneCount: z.number(),
  unit: z.string(),
  done: z.boolean(),
});

const CheckListTaskSchema = z.object({
  criteria: z.literal('checklist'),
  title: z.string(),
  description: z.string(),
  subTasks: z.array(
    z.object({
      title: z.string(),
      done: z.boolean(),
    })
  ),
  done: z.boolean(),
});

export const TaskSchema = z.discriminatedUnion('criteria', [TimeTaskSchema, CountTaskSchema, CheckListTaskSchema]);