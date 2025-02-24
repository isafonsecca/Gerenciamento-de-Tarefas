"use client";
//frontend

import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

export default function TodoList() {
    const { data: tasks, refetch } = trpc.getTasks.useQuery(); //useQuery utilizado para fazer uma requisicao buscando todas as tasks
    const createTask = trpc.createTask.useMutation({ //funcao para criar tarefa
      onSuccess: () => {
        refetch(); //apos operacao com sucesso a lista é atualizada
        setSuccessMessage("Tarefa adicionada com sucesso!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
    const updateTask = trpc.updateTask.useMutation({ //funcao para editar tarefa
      onSuccess: () => {
        refetch();
        setSuccessMessage("Tarefa editada com sucesso!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
    const deleteTask = trpc.deleteTask.useMutation({ //funcao para deletar tarefa
      onSuccess: () => {
        refetch();
        setSuccessMessage("Tarefa apagada com sucesso!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTask, setEditTask] = useState<{ id: string; title: string; description: string;} | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState<string | null>(null); // mensagem de erro
  const [successMessage, setSuccessMessage] = useState<string | null>(null); //mensagem de sucesso

  const handleAddTask = () => {
    if (title.trim()) { //verifica se nao esta vazio
      createTask.mutate({ title, description, completed: false, dataCriacao: new Date().toISOString() }); //se nao estiver vazio cria a tarefa
      setTitle("");
      setDescription("");
      setError(null);
    } else {
      setError("Tarefas não podem ser criadas sem título."); //se esta vazio envia mensagem de erro ao adicionar
    }
  };

  const formatDataCriacao = (data: string | Date): string => {
    return new Date(data).toLocaleDateString();
  }; //recebe uma data e devolve como string


  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center mx-auto">Tarefas</h1>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
        <div className="flex flex-col gap-2">
          <textarea
            className="border p-2 rounded-xl w-full"
            placeholder="Título da tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 rounded-xl h-32 align-top"
            placeholder="Descrição da tarefa..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-primary text-white px-4 py-2 rounded-xl"
            type="submit"
          >
            Adicionar
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>} 

      <ul className="space-y-5">
        {tasks?.map((task) => (
          <li key={task.id} className="border p-2 rounded-xl space-y-3 bg-white">
            {editTask?.id === task.id ? (
              <>
                <input
                  className="border p-2 rounded-xl"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="border p-2 rounded-xl"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="font-bold border-b border-gray-300 pb-2">
                  <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                </div>
                <p>{task.description}</p>
                <p className="flex justify-end text-sm text-gray-500 ">Data de postagem: {new Date().toLocaleDateString()}</p>
              </>
            )}
            <div className="flex gap-2">
              <button
                className="bg-accent text-white px-2 py-1 rounded-xl"
                onClick={() => updateTask.mutate({ id: task.id, completed: !task.completed, dataCriacao: new Date(task.dataCriacao) })}
              >
                {task.completed ? "Desfazer" : "Concluir"}
              </button>
              <button
                className="bg-secondary text-white px-2 py-1 rounded-xl"
                onClick={() => deleteTask.mutate(task.id)}
              >
                Deletar
              </button>
              {editTask?.id === task.id ? (
                <button
                  className="bg-save text-white px-2 py-1 rounded-xl"
                  onClick={() => {
                    updateTask.mutate({ id: task.id, title: editTitle, description: editDescription, dataCriacao: new Date(task.dataCriacao) });
                    setEditTask(null);
                  }}
                >
                  Salvar
                </button>
              ) : (
                <button
                  className="bg-muted text-white px-2 py-1 rounded-xl"
                  onClick={() => {
                    setEditTask({ ...task, description: task.description ?? "" });
                    setEditTitle(task.title);
                    setEditDescription(task.description ?? "");
                  }}
                >
                  Editar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
