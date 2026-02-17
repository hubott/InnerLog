"use client";

export default function TodayDate() {
  return (
    <h1 className="text-xl font-bold text-center">
      Today's date is: {new Date().toLocaleDateString()}
    </h1>
  );
}
