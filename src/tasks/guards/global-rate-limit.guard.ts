import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { subtractMinutes } from 'src/common/helpers/date';

import { TasksService } from '../tasks.service';

@Injectable()
export class GlobalRateLimitGuard implements CanActivate {
  constructor(
    private tasksService: TasksService,
    private configService: ConfigService
  ) {}

  canActivate(): boolean {
    const ratePeriod = this.configService.get<string>('CREATE_TASK_GLOBAL_RATE_PERIOD');
    const tasksLimit = this.configService.get<string>('CREATE_TASK_GLOBAL_RATE_LIMIT');

    if (!ratePeriod || !tasksLimit) {
      return true;
    }

    const timeLimit = subtractMinutes(+ratePeriod);
    const tasks = this.tasksService.findAll({
      created_at: timeLimit.toISOString(),
    });

    if (tasks.length >= +tasksLimit) {
      throw new HttpException(
        {
          message: 'Global rate limit exceeded. Try again later.',
          remainingRequests: +tasksLimit - tasks.length,
          windowInMinutes: ratePeriod,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
