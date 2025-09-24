import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req) {
    const user = { id: req.user.userId } as any; 
    return this.tasks.create(dto, user);
  }

  @Get() 
  findAll(@Req() req) {
    return this.tasks.findAllForUser({ id: req.user.userId } as any);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTaskDto, @Req() req) {
    return this.tasks.update(Number(id), dto, { id: req.user.userId } as any);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.tasks.remove(Number(id), { id: req.user.userId } as any);
  }
}
