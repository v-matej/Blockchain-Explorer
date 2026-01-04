export default function ChartCard({ title, children }) {
  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-5 space-y-4">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
}
