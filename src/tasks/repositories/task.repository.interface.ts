import { Nullable, Timestamp, UUID } from 'src/common/types';

import { FindAllTasksDto } from '../dto';
import { Task } from '../types';

export const TASK_REPOSITORY = 'TASK_REPOSITORY';

export interface TaskRepository {
  save(task: Task): Task;
  findAll(filters?: FindAllTasksDto): Task[];
  findById(id: UUID): Nullable<Task>;
  findOverlappingTasks(userId: UUID, startsAt: Timestamp, endsAt: Timestamp): Task[];
}
