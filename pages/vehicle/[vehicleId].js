import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const VehicleDetailsV2 = dynamic(() => import("../../components/vehicles/vehicleDetailsV2"), {
  ssr: false,
  loading: () => <p>Loading vehicle...</p>
});

export default function VehicleDetailRoute() {
  const router = useRouter();
  const { vehicleId } = router.query;

  if (!router.isReady || !vehicleId) {
    return <p>Loading vehicle...</p>;
  }

  return <VehicleDetailsV2 key={vehicleId} initialVehicleId={vehicleId} />;
}
