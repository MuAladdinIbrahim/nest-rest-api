import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TaskssService } from './taskss/taskss.service';

@Module({
  imports: [TasksModule],
  providers: [TaskssService],
})
export class AppModule {}
