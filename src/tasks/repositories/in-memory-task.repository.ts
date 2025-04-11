import { Injectable } from '@nestjs/common';

import { Nullable, Timestamp, UUID } from 'src/common/types';

import { FindAllTasksDto } from '../dto';
import { TaskRepository } from '.';
import { Task } from '../domain';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<UUID, Task> = new Map();

  private getTasks(): Task[] {
    return [...this.tasks.values()];
  }

  save(task: Task): Task {
    this.tasks.set(task.id, task);
    return task;
  }

  findAll(filters?: FindAllTasksDto): Task[] {
    let filteredTasks = this.getTasks();

    if (filters?.status) {
      filteredTasks = filteredTasks.filter((task) => task.status === filters.status);
    }

    if (filters?.user_id) {
      filteredTasks = filteredTasks.filter((task) => task.user_id === filters.user_id);
    }

    if (filters?.created_at) {
      filteredTasks = filteredTasks.filter((task) => task.created_at >= filters.created_at!);
    }

    return filteredTasks;
  }

  findById(id: UUID): Nullable<Task> {
    return this.tasks.get(id) || null;
  }

  findOverlappingTasks(userId: UUID, startsAt: Timestamp, endsAt: Timestamp): Task[] {
    return this.getTasks().filter((task) => task.isOverlappingWith(userId, startsAt, endsAt));
  }
}
