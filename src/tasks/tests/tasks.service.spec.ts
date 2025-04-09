import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { TasksService } from '../tasks.service';
import { CreateTaskDto } from '../dto';
import { TASK_REPOSITORY, InMemoryTaskRepository } from '../repositories';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: TASK_REPOSITORY, useClass: InMemoryTaskRepository }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const task: CreateTaskDto = {
        name: 'Test Task',
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      };

      const result = service.create(task);

      expect(result).toMatchObject(task);
      expect(result.id).toBeDefined();
      expect(result.created_at).toBeDefined();
    });

    it('should throw an error if the task is already created in this time period', () => {
      const task: CreateTaskDto = {
        name: 'Test Task',
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      };
      service.create(task);

      expect(() => service.create(task)).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    const tasks: CreateTaskDto[] = [
      {
        name: 'Test Task 1',
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      },
      {
        name: 'Test Task 2',
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
        user_id: '4cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      },
      {
        name: 'Test Task 3',
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
        user_id: '5cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      },
    ];

    beforeEach(() => {
      tasks.forEach((task) => service.create(task));
    });

    it('should return all tasks', () => {
      const result = service.findAll();
      expect(result).toMatchObject(tasks);
    });

    it('should return tasks filtered by user', () => {
      const result = service.findAll({ user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc' });
      expect(result).toMatchObject([tasks[0]]);
    });

    it('should return tasks filtered by status', () => {
      const newTasks = service.findAll({ status: 'new' });
      expect(newTasks.length).toBe(tasks.length);

      const completedTasks1 = service.findAll({ status: 'completed' });
      expect(completedTasks1.length).toBe(0);

      const allTasks = service.findAll();
      service.complete(allTasks[0].id);

      const completedTasks2 = service.findAll({ status: 'completed' });
      expect(completedTasks2.length).toBe(1);
      expect(completedTasks2).toMatchObject([{ ...allTasks[0], status: 'completed' }]);
    });

    it('should return tasks filtered by status and user', () => {
      const newTasks = service.findAll({
        status: 'new',
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      });
      expect(newTasks.length).toBe(1);

      const completedTasks1 = service.findAll({
        status: 'completed',
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      });
      expect(completedTasks1.length).toBe(0);

      const allTasks = service.findAll();
      allTasks.forEach((task) => service.complete(task.id));

      const completedTasks2 = service.findAll({
        status: 'completed',
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      });
      expect(completedTasks2.length).toBe(1);
      expect(completedTasks2).toMatchObject([{ ...allTasks[0], status: 'completed' }]);
    });
  });

  describe('complete', () => {
    it('should mark task as complete', () => {
      const task: CreateTaskDto = {
        name: 'Test Task',
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      };
      const createdTask = service.create(task);

      const result = service.complete(createdTask.id);
      expect(result).toMatchObject({ ...createdTask, status: 'completed' });
    });

    it('should throw an error if the task is not found', () => {
      expect(() => service.complete('123')).toThrow(NotFoundException);
    });

    it('should throw an error if the task is already completed', () => {
      const task: CreateTaskDto = {
        name: 'Test Task',
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
        user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
      };
      const createdTask = service.create(task);

      service.complete(createdTask.id);
      expect(() => service.complete(createdTask.id)).toThrow(BadRequestException);
    });
  });
});
