import bitcoinLogo from "../../assets/bitcoin.png";

export default function Loader({ text = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      {/* Bitcoin spinner */}
      <div className="w-50 h-50 flex items-center justify-center animate-spin-slow" >
        <img
                    src={bitcoinLogo}
                    alt="Bitcoin logo"
                    className="w-50 h-50 rounded-full"
                  />
      </div>

      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}
