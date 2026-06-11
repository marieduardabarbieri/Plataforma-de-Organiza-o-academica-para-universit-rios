// src/usecases/CreateTask.ts

import { prisma } from "../lib/db.js";
import { PriorityLevel } from "../generated/prisma/enums.js";

interface InputDto {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: PriorityLevel;
  userId: string;
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
