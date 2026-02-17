"use client";

export default function TodayDate() {
  return (
    <h1 className="text-xl font-bold text-center">
      Today is {new Date().toLocaleDateString("En-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </h1>
  );
}
