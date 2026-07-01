import { getTasks } from "@/_lib/api/fetch-generated";
import { TaskCard } from "./_components/task-card";

export default async function Home() {
  const response = await getTasks();

  if (response.status !== 200) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-xl font-bold">Erro ao carregar tarefas.</h1>
      </main>
    );
  }

  const tasks = response.data;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">Academic Organizer</h1>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p>Nenhuma tarefa cadastrada.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              completed={task.completed}
            />
          ))
        )}
      </div>
    </main>
  );
}
