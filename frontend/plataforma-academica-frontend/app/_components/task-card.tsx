type TaskCardProps = {
  title: string;
  description?: string;
  priority: string;
  completed: boolean;
};

export function TaskCard({
  title,
  description,
  priority,
  completed,
}: TaskCardProps) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>

      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}

      <div className="mt-4 flex justify-between text-sm">
        <span>
          Prioridade: <strong>{priority}</strong>
        </span>

        <span>{completed ? "✅ Concluída" : "⏳ Pendente"}</span>
      </div>
    </div>
  );
}
