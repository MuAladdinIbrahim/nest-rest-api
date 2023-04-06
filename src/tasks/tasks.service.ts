import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    let tasks: Task[] = this.tasks;

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }

    if (search) {
      tasks = tasks.filter((t) => {
        if (t.description.includes(search) || t.title.includes(search)) true;
        else false;
      });
    }
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      title,
      description,
      id: uuid(),
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((t) => t.id === id);
    if (!found) {
      throw new NotFoundException(`task with id: ${id} isn't found`);
    }
    return found;
  }

  deleteTaskById(id: string): void {
    const found: Task = this.getTaskById(id);
    this.tasks = this.tasks.filter((t) => t.id !== found.id);
  }

  updateTaskById(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task: Task = this.getTaskById(id);
    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description) task.description = updateTaskDto.description;
    if (updateTaskDto.status) task.status = updateTaskDto.status;
    return task;
  }
}
