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