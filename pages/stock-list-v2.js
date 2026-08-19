// pages/stock-list-v2.js
// Preview route for the Ichinomiya-style stock list. Kept class-free because the
// Tailwind content glob only scans ./components/**; all markup lives in the
// StocklistV2 component, which self-fetches its data.
import dynamic from "next/dynamic";

const StocklistV2 = dynamic(() => import("../components/misc/stockListV2"), {
  ssr: false,
  loading: () => <p>Loading stock...</p>,
});

export default function StockListV2Page() {
  return (
    <>
      <style>{`nextjs-portal{display:none !important}`}</style>
      <StocklistV2 />
    </>
  );
}
