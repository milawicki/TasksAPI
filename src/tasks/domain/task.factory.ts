import { randomUUID } from 'crypto';
import { Task } from './task.entity';
import { UUID, Timestamp } from 'src/common/types';

export function createTask(
  name: string,
  userId: UUID,
  startsAt: Timestamp,
  endsAt: Timestamp
): Task {
  return Task.create(randomUUID(), name, 'new', userId, startsAt, endsAt, new Date().toISOString());
}
