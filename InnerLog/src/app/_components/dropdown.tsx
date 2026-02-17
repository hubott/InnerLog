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
import Link from "next/link";

export function Dropdown() {

    const redirectToHome = () => {
        redirect("/home");
    }
    const redirectToNotes = () => {
        redirect("/notes");
    }
    const redirectToTasks = () => {
        redirect("/tasks");
    }
    const redirectToEpisodes = () => {
        redirect("/shows");
    }
    const redirectToCreateTasks = () => {
        redirect("/createTask");
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

export function Navbar() {

  return (
    <div className={`flex justify-between items-center w-full`}>
      <Dropdown />
              <button className="rounded-full bg-white/40 px-4 py-2 font-semibold transition hover:bg-white/20">
        <Link href="/api/auth/signout">Sign out</Link>
        </button>
    </div>
  )
}
