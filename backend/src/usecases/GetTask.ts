// src/usecases/GetTask.ts

import { NotFoundError } from "../errors/index.js";
import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
  taskId: string;
}

interface OutputDto {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: string;
  dueDate?: string;
}

export class GetTask {
  async execute(dto: InputDto): Promise<OutputDto> {
    //Buscar a tarefa
    const task = await prisma.task.findUnique({
      where: {
        id: dto.taskId,
      },
    });

    //Verificar se existe e pertence ao usuário
    if (!task || task.userId !== dto.userId) {
      throw new NotFoundError("Task not found");
    }

    //Retornar os dados
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? undefined,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
    };
  }
}
