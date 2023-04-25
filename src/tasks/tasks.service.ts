import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TasksRepository } from './tasks.repositroy';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(
      createTaskDto.title,
      createTaskDto.description,
    );
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    return found;
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(
        `task with id: "${id}" not found and can't be deleted`,
      );
    }
  }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const result = await this.tasksRepository.update(
      { id },
      { ...updateTaskDto },
    );
    if (result.affected > 0) {
      return this.getTaskById(id);
    }
    throw new NotFoundException(
      `task with id: "${id}" not found and can't be updated`,
    );
  }
}
