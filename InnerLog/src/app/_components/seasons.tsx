"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { Episodes } from "./episodes";

export function Seasons({ showId }: { showId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [seasons] = api.season.getSeasonsByShow.useSuspenseQuery({ showId });
  const [openSeasonId, setOpenSeasonId] = useState<string | null>(null);
  const utils = api.useUtils();
  const createSeason = api.season.create.useMutation({
    onMutate: () => setIsProcessing(true),
    onSettled: () => setIsProcessing(false),
    onSuccess: async () => {
      await utils.season.invalidate();
    },
  });

  const deleteSeason = api.season.deleteSeason.useMutation({
    onMutate: () => setIsProcessing(true),
    onSettled: () => setIsProcessing(false),
    onSuccess: async () => {
      await utils.season.invalidate();
    },
  });

  const [show] = api.show.getShowById.useSuspenseQuery({ showId });
  return (
    <div>
      {isProcessing && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <p className="text-white text-lg">Saving...</p>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Seasons for {show?.name ?? "Unknown Show"}</h2>
      <div>
      <ul className="space-y-2">
        {seasons.map((season) => {
          const isOpen = openSeasonId === season.id;
          return (
            <li key={season.id} className="border rounded-mg bg-white">
              <div className="flex items-center justify-between w-full bg-rose-200">
            <button
              className="flex-1 text-left px-4 py-2 bg-rose-200 hover:bg-rose-300 font-semibold hover:underline flex justify-between items-center cursor-pointer rounded"
              onClick={() =>
                setOpenSeasonId(isOpen ? null : season.id)
              }
            >
              <span> Season {season.number} </span>
              <span>{isOpen ? "▲" : "▼"}</span>
            </button>
            <ConfirmDeleteSeason itemName={`Season ${season.number}`} onDelete={() => deleteSeason.mutate({ seasonId: season.id })} isDeleting={deleteSeason.isPending} />
              </div>
            {isOpen && (
              <div className="px-4 py-3 border-t bg-stone-100">
                <Episodes seasonId={season.id} />
              </div>
            )}
          </li>
          );
        })}
      </ul>
      </div>


      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const value = formData.get("number");
          if(value === null) return;
          const number = Number(value);
          createSeason.mutate({ number, show: showId });
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="integer"
          name="number"
          placeholder="Enter season number"
          className="border border-gray-300 rounded px-3 py-2 bg-stone-100"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 cursor-pointer"
        >
          Add Season
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


export function ConfirmDeleteSeason({ itemName, isDeleting, onDelete }: ConfirmDeleteModalProps) {
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
              This will permanently delete <strong>all episodes</strong> associated with this season.
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