import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async findByTitle(title: string) {
    return this.findOne({ where: { title } });
  }

  async createTask(
    title: string,
    description: string,
    status: TaskStatus = TaskStatus.OPEN,
  ): Promise<Task> {
    const task = this.create({
      title,
      description,
      status,
    });
    await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    try {
      const { status, search } = filterDto;

      const query = this.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
          { search: `%${search}%` },
        );
      }

      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`failed to get tasks, error: ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
