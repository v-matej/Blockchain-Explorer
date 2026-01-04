export default function Loader({ text = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      {/* Bitcoin spinner */}
      <div
        className="w-16 h-16 rounded-full
                   bg-orange-500 text-black
                   flex items-center justify-center
                   text-3xl font-bold
                   animate-spin-slow"
      >
        ₿
      </div>

      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}
