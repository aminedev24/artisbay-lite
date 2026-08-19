// pages/cars/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CarDetails from '../../components/vehicles/carDetails';
import carData from '../../components/vehicles/carData';

export default function CarDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // this is the dynamic :id
  
  const [cars, setCars] = useState([]);

  useEffect(() => {
    setCars(carData);
  }, []);

  // If CarDetails component expects `cars` prop and internally picks out `cars.find(c=>c.id===id)`, 
  // just pass `cars` along. Or if you need to pass only the single car, you can do:
  // const singleCar = cars.find(c => String(c.id) === String(id));
  // return <CarDetails car={ singleCar } />; 
  // But if CarDetails expects the full `cars` array and does its own lookup, just do:
  return <CarDetails cars={cars} />;
}
