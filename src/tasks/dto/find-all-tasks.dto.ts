import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

import { Timestamp, UUID } from 'src/common/types';
import { TaskStatus, TaskStatusValues } from '../domain/types/task';

export class FindAllTasksDto {
  @IsOptional()
  @IsString()
  @IsIn(TaskStatusValues)
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  user_id?: UUID;

  created_at?: Timestamp;
}
