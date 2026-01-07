"use client";

import { useState } from "react";

import { api } from "~/trpc/react"; 

export default function NotePage() {
    const utils = api.useUtils();
    const [noteContent, setNoteContent] = useState("");
  const createNote = api.note.create.useMutation({
    onSuccess: async() => {
        await utils.note.invalidate();
        setNoteContent("");
    },
  });


  return (
    <div>
      <h1>Create a Note</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNote.mutate({ name: noteContent });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createNote.isPending}
        >
          {createNote.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
