import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from '../users/users.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  create(dto: CreateTaskDto, user: User) {
    const task = this.repo.create({
      tname: dto.tname,
      tdesc: dto.tdesc,
      status: dto.status ?? 0,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      user,
    });
    return this.repo.save(task);
  }

  findAllForUser(user: User) {
    return this.repo.find({ where: { user: { id: user.id } } });
  }

  async update(tid: number, dto: UpdateTaskDto, user: User) {
    const task = await this.repo.findOne({
      where: { tid },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.user.id !== user.id) throw new ForbiddenException('Forbidden');
    if (dto.tname !== undefined) task.tname = dto.tname;
    if (dto.tdesc !== undefined) task.tdesc = dto.tdesc;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.dueDate !== undefined) task.dueDate = new Date(dto.dueDate);

    return this.repo.save(task);
  }

  async remove(tid: number, user: User) {
    const task = await this.repo.findOne({
      where: { tid },
      relations: ['user'],
    });

    if (!task) throw new NotFoundException('Task not found');
    if (task.user.id !== user.id) throw new ForbiddenException('Forbidden');

    await this.repo.remove(task);
    return { message: 'Task deleted successfully' };
  }

}
