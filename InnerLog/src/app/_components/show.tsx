"use client";

import { useRef, useState } from "react";
import { redirect } from "next/navigation";

import { api } from "~/trpc/react";

export function Shows() {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shows] = api.show.getShows.useSuspenseQuery();
  const utils = api.useUtils();
  const createShow = api.show.create.useMutation({
    onMutate: () => setIsProcessing(true),
    onSettled: () => setIsProcessing(false),
    onSuccess: async () => {
      await utils.show.invalidate();
    },
  });
  const deleteShow = api.show.deleteShow.useMutation({
    onMutate: () => setIsProcessing(true),
    onSettled: () => setIsProcessing(false),
    onSuccess: async () => {
      await utils.show.invalidate();
    },
  });

  return (
    <div>
      {isProcessing && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <p className="text-white text-lg">Saving...</p>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">My Shows</h2>
      <ul>
        {shows.map((show) => (
          <li key={show.id} className="mb-2">
            <button onClick={() => redirect("/shows/" + show.id)} className="text-red-500 hover:underline cursor-pointer mr-2">
            {show.name}
            </button>
            <ConfirmDeleteModal itemName={show.name} onDelete={() => deleteShow.mutate({ showId: show.id })} isDeleting={deleteShow.isPending} />
          </li>
        ))}
      </ul>
      <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        formData.delete("name");
        createShow.mutate({ title: name });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }}
      className="mt-4 flex gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        name="name"
        placeholder="Enter show name"
        className="border border-gray-300 rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 cursor-pointer"
      >
        Add Show
      </button>
    </form>
    </div>
  );
}


interface ConfirmDeleteModalProps {
  itemName: string; // name of the show
  isDeleting: boolean;
  onDelete: () => void;
}

export default function ConfirmDeleteModal({ itemName, isDeleting, onDelete }: ConfirmDeleteModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Delete button triggers modal */}
      <button
        className="rounded-full bg-red-700 text-white px-6 py-2 font-semibold hover:bg-red-800 transition cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 flex flex-col gap-4 animate-fadeIn">
            <h2 className="text-xl font-semibold text-red-700">Confirm Deletion</h2>
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-semibold">{itemName}</span>?<br />
              This will permanently delete <strong>all seasons and episodes</strong> associated with this show.
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 cursor-pointer ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}