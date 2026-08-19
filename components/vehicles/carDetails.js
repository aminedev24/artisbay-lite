import React from 'react';
import { useRouter } from 'next/router';

const CarDetails = ({ cars }) => {
  const router = useRouter();
  const { id } = router.query;
  const car = cars.find((car) => car.id === parseInt(id));

  if (!car) {
    return <div>Car not found!</div>;
  }

  return (
    <div className="car-details">
      <img src={car.image} alt={car.name} />
      <div className="car-details-info">
        <h2>{car.name}</h2>
        <p>${car.price}</p>
        <p>{car.description}</p>
        <p>Year: {car.year}</p>
        <p>Location: {car.location}</p>
        <button>Contact Us for Export</button>
      </div>
    </div>
  );
};

export default CarDetails;
