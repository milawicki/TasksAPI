import { UUID, Timestamp } from 'src/common/types';

export interface Task {
  id: UUID;
  name: string;
  starts_at: Timestamp;
  ends_at: Timestamp;
  status: TaskStatus;
  user_id: UUID;
  created_at: Timestamp;
}

export const TaskStatusValues = ['new', 'completed'] as const;
export type TaskStatus = (typeof TaskStatusValues)[number];
