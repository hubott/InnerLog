"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { Priority, Status } from "~/../generated/prisma";


export function TaskCreator() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      setTitle("");
      setDueDate("");
      setPriority(null);
      setStatus(null);
    },
  });

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTask.mutate({ title, dueDate: dueDate ? new Date(dueDate) : new Date(), priority: priority ?? Priority.MEDIUM, status: status ?? Status.NOTCOMPLETED });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="What's the Task?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        />

        <label className="text-sm text-black/70">
        Due date
        </label>
        <input
          type="date"
          placeholder="Due Date"
          value={dueDate ?? ""}
          onChange={(e) => setDueDate(e.target.value || null)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        />




        <select
          value={priority ?? ""}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        >
          <option value="" disabled>Select Priority</option>

          {Object.values(Priority).map((prio) => (
            <option key={prio} value={prio}>
              {prio.charAt(0) + prio.slice(1).toLowerCase()}
            </option>
          ))}
        </select>


        <select
          value={status ?? ""}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        >
            <option value="" disabled>Select Status</option>
            {Object.values(Status).map((stat) => (
            <option key={stat} value={stat}>
              {stat.charAt(0) + stat.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createTask.isPending}
        >
          {createTask.isPending ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export function TaskList() {
  const [tasks] = api.task.getTasks.useSuspenseQuery();
  const [activeTab, setActiveTab] = useState<"overdue" | "today" | "upcoming">("today");
  type Status = "NOTCOMPLETED" | "INPROGRESS" | "COMPLETED";


  const priorityOrder: Record<Priority, number> = {
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
  };

  const statusLabels: Record<Status, string> = {
  NOTCOMPLETED: "Not Started",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const statusColours = {
  NOTCOMPLETED: "bg-gray-200 text-gray-700",
  INPROGRESS: "bg-yellow-200 text-yellow-800",
  COMPLETED: "bg-green-200 text-green-800",
};


  

  const today = new Date();
  today.setHours(0,0,0,0);


  function getCategory(task: { dueDate: Date }) {
    const due = new Date(task.dueDate);
    due.setHours(0,0,0,0);

    if (due < today) return "overdue";
    if (due.getTime() === today.getTime()) return "today";
    return "upcoming";
  }

  const filteredTasks = tasks.filter(task => getCategory(task) === activeTab);

  const sortedTasks = filteredTasks.sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <div>
        <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600 transition-colors" onClick={() => setActiveTab("today")}>Due Today</button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600 transition-colors" onClick={() => setActiveTab("overdue")}>Overdue</button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600 transition-colors" onClick={() => setActiveTab("upcoming")}>Not Due</button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
      <ul>
      {sortedTasks.length === 0 ? (
        <p className="text-gray-500 italic">
        No tasks that are {activeTab}
        </p>
        ) : (
          sortedTasks.map((task) => (
            <li key={task.id} className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            </div>
          <div className="mt-2">
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Priority: {task.priority}</p>
            <span className={statusColours[task.status]}>{statusLabels[task.status]}</span>
          </div>
        </li>
        ))
      )}
      </ul>
      </div>

      
        </div>
      )}
    </div>
  );
}