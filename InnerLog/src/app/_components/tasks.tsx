"use client";

import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { Priority, Status } from "~/../generated/prisma";
import "~/styles/globals.css";


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
          createTask.mutate({ title, dueDate: dueDate ? new Date(dueDate) : new Date(), priority: priority ?? Priority.MEDIUM, status: status ?? Status.NOTSTARTED });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="What's the Task?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-full bg-white/20 px-4 py-2 text-black transition hover:bg-white/30"
        />

        <label className="text-sm text-black/70">
        Due date
        </label>
        <input
          type="date"
          placeholder="Due Date"
          value={dueDate ?? ""}
          onChange={(e) => setDueDate(e.target.value || null)}
          className="w-full rounded-full bg-white/20 px-4 py-2 text-black cursor-pointer hover:bg-white/30 transition"
        />




        <select
          value={priority ?? ""}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full rounded-full bg-white/20 px-4 py-2 text-black cursor-pointer transition hover:bg-white/30"
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
          className="w-full rounded-full bg-white/20 px-4 py-2 text-black cursor-pointer transition hover:bg-white/30"
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
          className="rounded-full bg-white/20 px-10 py-3 font-semibold transition hover:bg-white/30 text-black cursor-pointer"
          disabled={createTask.isPending}
        >
          {createTask.isPending ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export function TaskList() {
  const utils = api.useUtils();
  const deleteTask = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
    },
  });
  const setStatus = api.task.setStatus.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
    },
  });
  const setPriority = api.task.setPriority.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
    },
  });
  const [tasks] = api.task.getTasks.useSuspenseQuery();
  const [activeTab, setActiveTab] = useState<"overdue" | "today" | "upcoming">("today");
  type Status = "NOTSTARTED" | "INPROGRESS" | "COMPLETED";


  const priorityOrder: Record<Priority, number> = {
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
  };

  const statusLabels: Record<Status, string> = {
  NOTSTARTED: "Not Started",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const statusColours = {
  NOTSTARTED: "bg-gray-200 text-gray-700",
  INPROGRESS: "bg-yellow-200 text-yellow-800",
  COMPLETED: "bg-green-200 text-green-800",
};

const newStatusColours = {
  NOTSTARTED: "bg-yellow-200 text-yellow-700 hover:bg-yellow-300",
  INPROGRESS: "bg-green-400 text-green-800 hover:bg-green-500",
  COMPLETED: "bg-blue-300 text-blue-800 hover:bg-blue-400",
};

const statusMessages = {
  NOTSTARTED: "Start Task",
  INPROGRESS: "Complete Task",
  COMPLETED: "Reopen Task",
}

function getNextStatus(status: Status): Status {
  if (status === "NOTSTARTED") return "INPROGRESS";
  if (status === "INPROGRESS") return "COMPLETED";
  return "NOTSTARTED"; // if completed → back to not completed
}


  

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
    if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
    if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
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

            <li
  key={task.id}
  className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex flex-col gap-3"
>
  {/* Title and delete button */}
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">{task.title}</h3>
    <ConfirmDeleteButton
      key={task.id}
      onDelete={() => deleteTask.mutate({ taskId: task.id })}
      isDeleting={deleteTask.isPending}
    />
  </div>

  {/* Date */}
  <div className="text-sm text-black/70">
    <label className="block mb-1">Due:</label>
    <p>{new Date(task.dueDate).toLocaleDateString()}</p>
  </div>

    {/* Priority */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Priority:</span>
      <select
  value={task.priority}
  onChange={(e) =>
          setPriority.mutate({ taskId: task.id, priority: e.target.value as Priority })
        }
  className={`rounded-full px-3 py-1 border cursor-pointer ${
    task.priority === "HIGH"
      ? "bg-red-200"
      : task.priority === "MEDIUM"
      ? "bg-yellow-200"
      : "bg-green-200"
  }`}
>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>    
        
      </select>
    </div>

    {/* Status */}
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded text-sm ${statusColours[task.status]}`}>
        {statusLabels[task.status]}
      </span>
      <button
        onClick={() =>
          setStatus.mutate({ taskId: task.id, status: getNextStatus(task.status) })
        }
        className={`text-white px-3 py-1 rounded ${newStatusColours[task.status]} cursor-pointer`}
      >
        {statusMessages[task.status]}
      </button>
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




function ConfirmDeleteButton({ onDelete, isDeleting }: { onDelete: () => void; isDeleting: boolean }) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;

    const timeout = setTimeout(() => {
      setConfirming(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [confirming]);

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          className="rounded-full bg-red-700 text-white px-6 py-2 font-semibold transition hover:bg-red-800 mt-2 cursor-pointer"
          onClick={() => {
            onDelete();
            setConfirming(false);
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button className="text-white bg-green-700 hover:text-white hover:bg-green-800 px-6 py-2 mt-2 cursor-pointer rounded-full" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button className="rounded-full bg-red-700 text-white px-6 py-2 font-semibold transition hover:bg-red-800 mt-2 cursor-pointer" onClick={() => setConfirming(true)}>
      Delete
    </button>
  );
}