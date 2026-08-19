import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const VehicleDetailsV2 = dynamic(() => import("../components/vehicles/vehicleDetailsV2"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary-color)]/20 border-t-[var(--accent-color)]" />
    </div>
  )
});

export default function VehiclePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady || !id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary-color)]/20 border-t-[var(--accent-color)]" />
      </div>
    );
  }

  return <VehicleDetailsV2 key={id} initialVehicleId={id} />;
}
