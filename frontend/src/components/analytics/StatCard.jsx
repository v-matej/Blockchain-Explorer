export default function StatCard({ title, value, description }) {
  return (
    <div className="border border-neutral-800 bg-neutral-900 rounded-lg p-4">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-semibold text-orange-400 mt-1">
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {description}
      </div>
    </div>
  );
}
