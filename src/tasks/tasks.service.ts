import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UUID } from 'src/common/types';

import { CreateTaskDto, FindAllTasksDto } from './dto';
import { Task, createTask } from './domain';
import { TASK_REPOSITORY, TaskRepository } from './repositories';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository
  ) {}

  create(data: CreateTaskDto): Task {
    const overlappingTasks = this.taskRepository.findOverlappingTasks(
      data.user_id,
      data.starts_at,
      data.ends_at
    );

    if (overlappingTasks.length > 0) {
      throw new BadRequestException('User already has a task in this time period');
    }

    const task = createTask(data.name, data.user_id, data.starts_at, data.ends_at);
    return this.taskRepository.save(task);
  }

  findAll(filters?: FindAllTasksDto): Task[] {
    return this.taskRepository.findAll(filters);
  }

  complete(id: UUID): Task {
    const task = this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    try {
      const completedTask = task.setAsCompleted();
      return this.taskRepository.save(completedTask);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
