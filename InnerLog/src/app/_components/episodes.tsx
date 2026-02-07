"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast, Toaster } from "react-hot-toast";
import { promise } from "zod";


export function Episodes({ seasonId }: { seasonId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [episodes] = api.episode.getEpisodesBySeason.useSuspenseQuery({ seasonId });
  const [openEpisodeId, setOpenEpisodeId] = useState<string | null>(null);
  const utils = api.useUtils();
  const deleteEpisode = api.episode.deleteEpisode.useMutation({
    onMutate: (vars) => setLoadingId(vars.episodeId),
    onSettled: () => setLoadingId(null),
    onSuccess: async () => {
      await utils.episode.invalidate();
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Episodes</h2>
      <ul>
        {episodes.map((episode) => {
          const isOpen = openEpisodeId === episode.id;
          return (
            <li key={episode.id} className="border rounded-md">
              <div className="flex items-center justify-between w-full bg-rose-200">
              <button 
                className="text-amber-500 hover:underline cursor-pointer" 
                onClick={() => setOpenEpisodeId(isOpen ? null : episode.id)}
                >
                <span> Episode {episode.number}: {episode.title} </span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </button>
              <ConfirmDeleteModal itemName={`Episode ${episode.number}: ${episode.title}`} onDelete={() => deleteEpisode.mutateAsync({ episodeId: episode.id })} isDeleting={loadingId === episode.id} />
              </div>
              {isOpen && (
                <div className="border-t px-3 py-2 bg-rose-400 text-sm space-y-1">
                  <p><strong>Thoughts:</strong> {episode.thoughts}</p>
                  <p><strong>Rating:</strong> {episode.rating}/10</p>
                </div>
              )}
            </li>
          );
        })}

      </ul>
      <AddEpisode seasonId={seasonId} setIsProcessing={setIsProcessing} isProcessing={isProcessing} />
    </div>
  );
}

export function AddEpisode({ seasonId, setIsProcessing, isProcessing }: { seasonId: string; setIsProcessing: (value: boolean) => void; isProcessing: boolean }) {
  const utils = api.useUtils();
  const createEpisode = api.episode.create.useMutation({
    onMutate: () => setIsProcessing(true),
    onSettled: () => setIsProcessing(false),
    onSuccess: async () => {
      // Invalidate episode queries after successful creation
      await utils.episode.invalidate();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const promise = createEpisode.mutateAsync({ title, season: seasonId, number: Number(formData.get("number")), thoughts: formData.get("thoughts") as string, rating: Number(formData.get("rating")) });
        toast.promise(promise, {
          loading: "Adding episode...",
          success: "Episode added!",
          error: "Failed to add episode. Please try again."
        });
        (e.currentTarget as HTMLFormElement).reset();
      }}
      className="mt-4 flex flex-wrap gap-2"
    >
      <input
        type="text"
        name="title"
        placeholder="Enter episode title"
        className="border border-gray-300 rounded px-3 py-2"
      />
      <input
        type="number"
        name="number"
        placeholder="Episode number"
        className="border border-gray-300 rounded px-3 py-2"
      />
      <input
        type="number"
        name="rating"
        placeholder="Rating (0-10)"
        className="border border-gray-300 rounded px-3 py-2 min-w-35"
        min={0}
        max={10}
      />
      <textarea
      name="thoughts"
      placeholder="Your thoughts"
      rows={2}
      className="border border-gray-300 rounded px-3 py-2 resize-none w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        disabled={isProcessing}
      >
        Add Episode
      </button>
    </form>
  );
}




interface ConfirmDeleteModalProps {
  itemName: string; // name of the show
  isDeleting: boolean;
  onDelete: () => Promise<any>;
}

export default function ConfirmDeleteModal({ itemName, isDeleting, onDelete }: ConfirmDeleteModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Delete button triggers modal */}
      <button
        className="rounded-full bg-red-700 text-white px-6 py-2 font-semibold hover:bg-red-800 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        onClick={() => setOpen(true)}
        disabled={isDeleting}
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
              This will permanently delete <strong>all data</strong> associated with this episode.
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
                    const promise = onDelete();
                    toast.promise(promise, {
                      loading: "Deleting show...",
                      success: "Show deleted!",
                      error: "Failed to delete show. Please try again."
                    });
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