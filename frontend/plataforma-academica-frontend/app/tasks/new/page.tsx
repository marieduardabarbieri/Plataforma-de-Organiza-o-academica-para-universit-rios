"use client";

import { useState } from "react";
import { postTasks, PostTasksBodyPriority } from "@/_lib/api/fetch-generated";

export default function NewTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PostTasksBodyPriority>("MEDIUM");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await postTasks({
      title,
      description,
      priority,
    });

    if (response.status === 201) {
      alert("Tarefa criada com sucesso!");

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
    } else {
      alert("Erro ao criar tarefa.");
      console.log(response);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col p-8">
      <h1 className="mb-8 text-4xl font-bold">Nova tarefa</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label>Título</label>

          <input
            className="mt-2 w-full rounded border p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Descrição</label>

          <textarea
            className="mt-2 w-full rounded border p-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Prioridade</label>

          <select
            className="mt-2 w-full rounded border p-3"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as PostTasksBodyPriority)
            }
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>

        <button
          className="rounded bg-blue-600 px-5 py-3 text-white"
          type="submit"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
