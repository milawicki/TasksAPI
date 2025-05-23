import { createTask } from '../domain';
import { InMemoryTaskRepository } from '../repositories';

describe('InMemoryTaskRepository', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findOverlappingTasks', () => {
    const task = createTask(
      'Task 1',
      '1',
      new Date('2025-01-01 10:00:00').toISOString(),
      new Date('2025-01-01 12:00:00').toISOString()
    );

    beforeEach(() => {
      repository.save(task);
    });

    it('should return empty array for different user', () => {
      const differentUser = repository.findOverlappingTasks(
        '2',
        new Date('2025-01-01 10:00:00').toISOString(),
        new Date('2025-01-01 12:00:00').toISOString()
      );
      expect(differentUser).toEqual([]);
    });

    it('should return empty array for different time', () => {
      const differentTime = repository.findOverlappingTasks(
        '1',
        new Date('2025-01-02 11:00:00').toISOString(),
        new Date('2025-01-02 13:00:00').toISOString()
      );
      expect(differentTime).toEqual([]);
    });

    it('should return overlapping tasks - same time', () => {
      const overlappingTask = repository.findOverlappingTasks(
        '1',
        new Date('2025-01-01 10:00:00').toISOString(),
        new Date('2025-01-01 12:00:00').toISOString()
      );
      expect(overlappingTask).toEqual([task]);
    });

    it('should return overlapping tasks - ends within other task', () => {
      const overlappingTask = repository.findOverlappingTasks(
        '1',
        new Date('2025-01-01 9:00:00').toISOString(),
        new Date('2025-01-01 11:00:00').toISOString()
      );
      expect(overlappingTask).toEqual([task]);
    });

    it('should return overlapping tasks - starts within other task', () => {
      const overlappingTask = repository.findOverlappingTasks(
        '1',
        new Date('2025-01-01 11:00:00').toISOString(),
        new Date('2025-01-01 13:00:00').toISOString()
      );
      expect(overlappingTask).toEqual([task]);
    });

    it('should return overlapping tasks - contains other task', () => {
      const overlappingTask = repository.findOverlappingTasks(
        '1',
        new Date('2025-01-01 10:30:00').toISOString(),
        new Date('2025-01-01 11:00:00').toISOString()
      );
      expect(overlappingTask).toEqual([task]);
    });
  });
});
