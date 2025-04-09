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
export class UserRateLimitGuard implements CanActivate {
  constructor(
    private tasksService: TasksService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.body?.user_id;

    const ratePeriod = this.configService.get<string>('CREATE_TASK_USER_RATE_PERIOD');
    const tasksLimit = this.configService.get<string>('CREATE_TASK_USER_RATE_LIMIT');

    if (!ratePeriod || !tasksLimit || !userId) {
      return true;
    }

    const timeLimit = subtractMinutes(+ratePeriod);
    const tasks = this.tasksService.findAll({
      user_id: userId,
      created_at: timeLimit.toISOString(),
    });

    if (tasks.length >= +tasksLimit) {
      throw new HttpException(
        {
          message: 'User rate limit exceeded. Try again later.',
          remainingRequests: +tasksLimit - tasks.length,
          windowInMinutes: ratePeriod,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
