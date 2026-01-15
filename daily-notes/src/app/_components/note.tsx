"use client";

import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { MAX_NOTE_LENGTH } from "~/lib/utils";

export function Note() {
  const [noteContent, setNoteContent] = useState("");
  const createNote = api.note.create.useMutation({
    onSuccess: async () => {
      setNoteContent("");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= MAX_NOTE_LENGTH) {
        setNoteContent(value);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNote.mutate({ name: noteContent });
        }}
        className="flex flex-col gap-2"
      >
        <textarea
          placeholder="Today I did..."
          value={noteContent}

          onChange={(e) => { handleChange(e); }}
          className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
          rows={5}
        />
        <div className="pointer-events-none text-sm text-gray-400 text-right">
            {noteContent.length}/{MAX_NOTE_LENGTH}
            </div>
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createNote.isPending}
        >
          {createNote.isPending ? "Saving..." : "Save Note"}
        </button>
      </form>
    </div>
  );
}

export function GetNotes() {
  const [notes] = api.note.getNotes.useSuspenseQuery();
  const utils = api.useUtils();

   const deleteNote = api.note.deleteNote.useMutation({
    onSuccess: async () => {
      await utils.note.getNotes.invalidate();
    },
  });
  const editNote = api.note.editNote.useMutation({
    onSuccess: async () => {
      await utils.note.getNotes.invalidate();
    },
  });

  return (
    <div className="w-full max-w-md mt-6">
      <h2 className="text-2xl mb-4 text-center">Your Notes</h2>
      <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-center w-full">
              <p>{note.contents}</p>
              <ConfirmDeleteButton key={note.id} onDelete={() => deleteNote.mutate({ id: note.id})} isDeleting={deleteNote.isPending}/>

              </div>
              <div className="flex justify-between items-center w-full">
              <p className="text-sm text-black-400 mt-2">
                {new Date(note.date ?? new Date()).toLocaleDateString("en-GB")}
              </p>
              <EditableNote key={note.id} note={note} onSave={(newContent) => {
                editNote.mutate({ id: note.id, contents: newContent });
              }} />
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
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
          className="rounded-full bg-white/10 text-red-700 px-6 py-2 font-semibold transition hover:bg-white/20 mt-2 cursor-pointer"
          onClick={() => {
            onDelete();
            setConfirming(false);
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button className="text-gray-400 hover:text-white cursor-pointer" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button className="rounded-full bg-white/10 text-red-700 px-6 py-2 font-semibold transition hover:bg-white/20 mt-2 cursor-pointer" onClick={() => setConfirming(true)}>
      Delete
    </button>
  );
}

function EditableNote({
    note,
    onSave
    }: {
    note: { id: string; contents: string | null; date: Date | null };
    onSave: (newContent: string) => void;
    }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(note.contents ?? "");

      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= MAX_NOTE_LENGTH) {
        setEditedContent(value.slice(0, MAX_NOTE_LENGTH));
    }
  };
    

    return (
        <div>
            {isEditing ? (
            <div>
        <textarea
            value={editedContent}
            onChange={(e) => handleChange(e)}
            maxLength={MAX_NOTE_LENGTH}
            className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
            rows={5}
        />
        <div className="pointer-events-none text-sm text-gray-400 text-right">
        {editedContent.length}/{MAX_NOTE_LENGTH}
        </div>
        <button
            className="rounded-full bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20 mt-2 cursor-pointer" 
            onClick={() => {onSave(editedContent); 
                setIsEditing(false)}}
        >
            Save
        </button>
        <button
            className="rounded-full bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20 mt-2 cursor-pointer"
            onClick={() => {setIsEditing(false); setEditedContent(note.contents ?? "")}}
        >
            Cancel
        </button>
        </div>
    ): (
        <div>
            <button
                className="rounded-full bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20 mt-2 cursor-pointer"
                onClick={() => setIsEditing(true)}
            >
                Edit
            </button>
        </div>
    )}
    </div>

    );
}