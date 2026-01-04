import BlockOverviewPanel from "../components/block/BlockOverviewPanel";
import BlockTxList from "../components/block/BlockTxList";

export default function BlockPage({ data, onOpenTx, onOpenBlock }) {
  if (!data) return null;

  return (
    <div className="max-w-[1700px] mx-auto px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1.3fr] gap-10">
        <BlockOverviewPanel
          summary={data.summary}
          raw={data.raw}
          onOpenBlock={onOpenBlock}
        />

        <BlockTxList
          txs={data.raw.tx}
          onOpenTx={onOpenTx}
        />
      </div>
    </div>
  );
}
