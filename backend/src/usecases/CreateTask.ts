import { PriorityLevel } from "../generated/prisma/enums.js";
import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: PriorityLevel;
  subjectId?: string;
}

export class CreateTask {
  async execute(dto: InputDto) {
    const task = await prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate,
        priority: dto.priority,
        userId: dto.userId,
        subjectId: dto.subjectId,
      },
    });

    return task;
  }
}
