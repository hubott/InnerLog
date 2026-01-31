"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

export function Shows() {
  const [shows] = api.show.getShows.useSuspenseQuery();
  const utils = api.useUtils();
  const createShow = api.show.create.useMutation({
    onSuccess: async () => {
      await utils.show.invalidate();
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Shows</h2>
      <ul>
        {shows.map((show) => (
          <li key={show.id} className="mb-2">
            <button onClick={() => redirect("/shows/" + show.id)} className="text-blue-500 hover:underline cursor-pointer">
            {show.name}
            </button>
          </li>
        ))}
      </ul>
      <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        createShow.mutate({ title: name });
      }}
      className="mt-4 flex gap-2"
    >
      <input
        type="text"
        name="name"
        placeholder="Enter show name"
        className="border border-gray-300 rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Show
      </button>
    </form>
    </div>
  );
}

export function Seasons({ showId }: { showId: string }) {
  const [seasons] = api.season.getSeasonsByShow.useSuspenseQuery({ showId });
  const [openSeasonId, setOpenSeasonId] = useState<string | null>(null);
  const utils = api.useUtils();
  const createSeason = api.season.create.useMutation({
    onSuccess: async () => {
      await utils.season.invalidate();
    },
  });
  const [show] = api.show.getShowById.useSuspenseQuery({ showId });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Seasons for {show?.name ? show.name : "Unknown Show"}</h2>
      <div>
      <ul className="space-y-2">
        {seasons.map((season) => {
          const isOpen = openSeasonId === season.id;
          return (
            <li key={season.id} className="border rounded-mg bg-white">
            <button
              className="w-full text-left px-4 py-2 bg-rose-200 hover:bg-rose-300 font-semibold hover:underline flex justify-between items-center cursor-pointer"
              onClick={() =>
                setOpenSeasonId(isOpen ? null : season.id)
              }
            >
              <span> Season {season.number} </span>
              <span>{isOpen ? "▲" : "▼"}</span>
            </button>
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
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Season
        </button>
      </form>
    </div>
  );
}

export function Episodes({ seasonId }: { seasonId: string }) {
  const [episodes] = api.episode.getEpisodesBySeason.useSuspenseQuery({ seasonId });
  const [openEpisodeId, setOpenEpisodeId] = useState<string | null>(null);
  const utils = api.useUtils();
  const createEpisode = api.episode.create.useMutation({
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
              <button 
                className="text-amber-500 hover:underline cursor-pointer" 
                onClick={() => setOpenEpisodeId(isOpen ? null : episode.id)}
                >
                <span> Episode {episode.number}: {episode.title} </span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </button>
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
      <AddEpisode seasonId={seasonId} />
    </div>
  );
}

export function AddEpisode({ seasonId }: { seasonId: string }) {
  const utils = api.useUtils();
  const createEpisode = api.episode.create.useMutation({
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
        createEpisode.mutate({ title, season: seasonId, number: Number(formData.get("number")), thoughts: formData.get("thoughts") as string, rating: Number(formData.get("rating")) });
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
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Episode
      </button>
    </form>
  );
}