export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Title */}
      <div className="h-8 w-48 bg-gray-300 rounded" />

      {/* Card */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-300 rounded" />
        <div className="h-4 w-5/6 bg-gray-300 rounded" />
        <div className="h-4 w-2/3 bg-gray-300 rounded" />
      </div>

      {/* Big box */}
      <div className="h-40 w-full bg-gray-300 rounded-xl" />
    </div>
  );
}
