// src/usecases/UpdateTask.ts

import { NotFoundError } from "../errors/index.js";
import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
  taskId: string;
}

export class UpdateTask {
  async execute(dto: InputDto) {
    const task = await prisma.task.findUnique({
      where: {
        id: dto.taskId,
      },
    });

    if (!task || task.userId !== dto.userId) {
      throw new NotFoundError("Task not found");
    }

    return prisma.task.update({
      where: {
        id: dto.taskId,
      },
      data: {
        completed: true,
      },
    });
  }
}
