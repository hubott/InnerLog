"use client";

export default function TodayDate() {
  return (
    <h1 className="text-xl font-bold text-center">
      Today&apos;s date is: {new Date().toLocaleDateString()}
    </h1>
  );
}
