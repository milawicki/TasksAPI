import { Injectable } from '@nestjs/common';

import { Nullable, Timestamp, UUID } from 'src/common/types';

import { FindAllTasksDto } from '../dto';
import { TaskRepository } from '.';
import { Task } from '../types';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  save(task: Task): Task {
    const existingTaskIndex = this.tasks.findIndex((t) => t.id === task.id);

    if (existingTaskIndex >= 0) {
      this.tasks[existingTaskIndex] = task;
    } else {
      this.tasks.push(task);
    }

    return task;
  }

  findAll(filters?: FindAllTasksDto): Task[] {
    let filteredTasks = [...this.tasks];

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
    const task = this.tasks.find((t) => t.id === id);
    return task || null;
  }

  findOverlappingTasks(userId: UUID, startsAt: Timestamp, endsAt: Timestamp): Task[] {
    return this.tasks.filter(
      (task) => task.user_id === userId && task.starts_at <= endsAt && task.ends_at >= startsAt
    );
  }
}
