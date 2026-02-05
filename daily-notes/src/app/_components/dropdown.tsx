"use client"

import * as React from "react"

import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { redirect } from "next/navigation";

export function Dropdown() {

    const redirectToHome = () => {
        redirect("/home");
    }
    const redirectToNotes = () => {
        redirect("/notes");
    }
    const redirectToTasks = () => {
        redirect("/getTasks");
    }
    const redirectToEpisodes = () => {
        redirect("/shows");
    }
    const redirectToCreateTasks = () => {
        redirect("/tasks");
    }

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full text-black px-4 py-6 font-semibold transition hover:bg-white/20 text-2xl cursor-pointer">☰</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-black font-bold">Navigate to:</DropdownMenuLabel>
        <DropdownMenuItem onSelect={redirectToHome} className="cursor-pointer">
          Home
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={redirectToNotes} className="cursor-pointer">
          Your Notes
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={redirectToCreateTasks} className="cursor-pointer">
          Create Tasks
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={redirectToTasks} className="cursor-pointer">
          Your Tasks
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={redirectToEpisodes} className="cursor-pointer">
          Your Shows
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
