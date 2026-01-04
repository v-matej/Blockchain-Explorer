import BlockOverviewPanel from "../components/block/BlockOverviewPanel";
import BlockTxList from "../components/block/BlockTxList";

export default function BlockPage({ data }) {
  if (!data) return null;

  return (
    <div className="max-w-[1700px] mx-auto px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1.6fr] gap-10">
        <BlockOverviewPanel
          summary={data.summary}
          raw={data.raw}
        />

        <BlockTxList
          txs={data.raw.tx}
        />
      </div>
    </div>
  );
}
