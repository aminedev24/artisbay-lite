// pages/stock-list.js
import dynamic from "next/dynamic";

const StocklistV2 = dynamic(() => import("../components/misc/stockListV2"), {
  ssr: false,
  loading: () => <p>Loading stock...</p>,
});

export default function StockListPage() {
  return <StocklistV2 />;
}
