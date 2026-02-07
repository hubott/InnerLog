"use client";

import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { MAX_NOTE_LENGTH } from "~/lib/utils";
import { toast, Toaster} from "react-hot-toast";

export function Note() {

  const utils = api.useUtils();
  const [noteContent, setNoteContent] = useState("");
  // Create a note, clearing the stored note content then invalidate the getNotes query to refetch 
  // the list of notes with the new note included
  const createNote = api.note.create.useMutation({
    onSuccess: async () => {
      setNoteContent("");
      await utils.note.getNotes.invalidate();
    },
  });

  // Handle change for the textarea, ensuring that the content does not exceed the maximum length
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
          const promise = createNote.mutateAsync({ name: noteContent });
          toast.promise(promise, {
               loading: "Saving note...",
               success: "Note saved!",
               error: "Failed to save note. Please try again."
             });
        }}
        className="flex flex-col gap-2"
      >
        <textarea
          placeholder="Today I did..."
          value={noteContent}

          onChange={(e) => { handleChange(e); }}
          className="w-full rounded-lg bg-white/40 px-4 py-2 text-black"
          rows={5}
        />
        <div className="pointer-events-none text-sm text-gray-400 text-right">
            {noteContent.length}/{MAX_NOTE_LENGTH}
            </div>
        <button
          type="submit"
          className="rounded-full bg-amber-500 px-10 py-3 font-semibold transition hover:bg-amber-700 text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          disabled={createNote.isPending}
        >
          {createNote.isPending ? "Saving..." : "Save Note"}
        </button>
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
}

export function GetNotes() {
  const [notes] = api.note.getNotes.useSuspenseQuery();
  const utils = api.useUtils();
  const [loadingId, setLoadingId] = useState<string | null>(null);

   const deleteNote = api.note.deleteNote.useMutation({
    onMutate: (vars) => setLoadingId(vars.id),
    onSettled: () => setLoadingId(null),
    onSuccess: async () => {
      await utils.note.getNotes.invalidate();
    },
  });
  const editNote = api.note.editNote.useMutation({
    onMutate: (vars) => setLoadingId(vars.id),
    onSettled: () => setLoadingId(null),
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
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className={`bg-amber-50 border border-amber-200 p-4 rounded-lg ${loadingId === note.id ? "opacity-50" : ""}`}>
                <div className="flex justify-between items-center w-full">
              <p>{note.contents}</p>
              <ConfirmDeleteButton key={note.id} onDelete={() => deleteNote.mutateAsync({ id: note.id})} isDeleting={loadingId === note.id}/>

              </div>
              <div className="flex justify-between items-center w-full">
              <p className="text-sm text-black-400 mt-2">
                {new Date(note.date ?? new Date()).toLocaleDateString("en-GB")}
              </p>
              <EditableNote key={note.id} isSaving={loadingId === note.id} note={note} onSave={(newContent) => editNote.mutateAsync({ id: note.id, contents: newContent })} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

function ConfirmDeleteButton({ onDelete, isDeleting }: { onDelete: () => Promise<any>; isDeleting: boolean }) {
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
          
          disabled={isDeleting}
          onClick={() => {
            const promise = onDelete();
            toast.promise(promise, {
              loading: "Deleting note...",
              success: "Note deleted!",
              error: "Failed to delete note. Please try again."
            },
            
            );
            setConfirming(false);
          }}
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
    <button className="rounded-full bg-red-700 text-white px-6 py-2 font-semibold transition hover:bg-red-800 mt-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400" 
    onClick={() => setConfirming(true)}
    disabled={isDeleting}
    >
       Delete
    </button>
  );
}

function EditableNote({
    note,
    onSave,
    isSaving,
    }: {
    note: { id: string; contents: string | null; date: Date | null };
    onSave: (newContent: string) => Promise<any>;
    isSaving: boolean;
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
            className="w-full rounded-lg bg-white/10 px-4 py-2 text-black border border-amber-400"
            rows={5}
        />
        <div className="pointer-events-none text-sm text-gray-400 text-right">
        {editedContent.length}/{MAX_NOTE_LENGTH}
        </div>
        <button
            className="rounded-full bg-amber-500 px-6 py-2 font-semibold transition hover:bg-amber-700 mt-2 cursor-pointer text-white" 
            onClick={() => {
              const promise = onSave(editedContent);
              toast.promise(promise, {
                loading: "Saving note...",
                success: "Note updated!",
                error: "Failed to update note. Please try again."
              });
              setIsEditing(false)}}
        >
            Save
        </button>
        <button
            className="rounded-full bg-amber-500  px-6 py-2 font-semibold transition hover:bg-amber-700 mt-2 cursor-pointer text-white"
            onClick={() => {setIsEditing(false); setEditedContent(note.contents ?? "")}}
        >
            Cancel
        </button>
        </div>
    ): (
        <div>
            <button
                className="rounded-full bg-amber-500 px-8.5 py-2 font-semibold transition hover:bg-amber-700 mt-2 cursor-pointer text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                onClick={() => setIsEditing(true)}
                disabled={isSaving}
            >
                Edit
            </button>
        </div>
    )}
    </div>

    );
}