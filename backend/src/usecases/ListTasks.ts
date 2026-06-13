// Importa a instância do Prisma para acessar o banco de dados
import { PriorityLevel } from "../generated/prisma/enums.js";
import { prisma } from "../lib/db.js";

// Dados que o caso de uso precisa receber
interface InputDto {
  // Usuário autenticado
  userId: string;
}

// Dados que serão retornados pelo caso de uso
interface OutputDto {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: PriorityLevel;
}

// Classe responsável por listar as tarefas do usuário
export class ListTasks {
  // Método principal do caso de uso
  async execute(dto: InputDto): Promise<OutputDto[]> {
    // Busca todas as tarefas pertencentes ao usuário
    const tasks = await prisma.task.findMany({
      where: {
        userId: dto.userId,
      },

      // Ordena da mais recente para a mais antiga
      orderBy: {
        createdAt: "desc",
      },
    });

    // Converte os dados vindos do banco para o formato
    // definido no OutputDto
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,

      // Se description for null no banco,
      // retorna undefined na API
      description: task.description ?? undefined,

      // Status de conclusão
      completed: task.completed,

      // Prioridade da tarefa
      priority: task.priority,
    }));
  }
}
