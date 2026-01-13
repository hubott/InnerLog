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

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full text-black px-4 py-6 font-semibold transition hover:bg-white/20 text-2xl">☰</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-black font-bold">Navigate to:</DropdownMenuLabel>
        <DropdownMenuItem onSelect={redirectToHome}>
          Home
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={redirectToNotes}>
          Your Notes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
