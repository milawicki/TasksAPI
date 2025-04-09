import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'src/common/types';

import { TasksService } from './tasks.service';
import { CreateTaskDto, FindAllTasksDto } from './dto';
import { GlobalRateLimitGuard, UserRateLimitGuard } from './guards';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(UserRateLimitGuard, GlobalRateLimitGuard)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() filters: FindAllTasksDto) {
    return this.tasksService.findAll(filters);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.tasksService.complete(id);
  }
}
