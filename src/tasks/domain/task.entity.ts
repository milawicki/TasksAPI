import { Timestamp, UUID } from 'src/common/types';
import { TaskStatus } from './types';
import { TaskAlreadyCompletedException, ValidationError } from '.';

export class Task {
  private constructor(
    public readonly id: UUID,
    public readonly name: string,
    public readonly status: TaskStatus,
    public readonly user_id: UUID,
    public readonly starts_at: Timestamp,
    public readonly ends_at: Timestamp,
    public readonly created_at: Timestamp
  ) {}

  static create(
    id: UUID,
    name: string,
    status: TaskStatus,
    userId: UUID,
    startsAt: Timestamp,
    endsAt: Timestamp,
    createdAt: Timestamp
  ): Task {
    if (endsAt <= startsAt) {
      throw new ValidationError('End date must be after start date');
    }

    return new Task(id, name, status, userId, startsAt, endsAt, createdAt);
  }

  setAsCompleted(): Task {
    if (this.status === 'completed') {
      throw new TaskAlreadyCompletedException();
    }

    return new Task(
      this.id,
      this.name,
      'completed',
      this.user_id,
      this.starts_at,
      this.ends_at,
      this.created_at
    );
  }

  isOverlappingWith(userId: UUID, startsAt: Timestamp, endsAt: Timestamp): boolean {
    return this.user_id === userId && this.starts_at <= endsAt && this.ends_at >= startsAt;
  }
}
