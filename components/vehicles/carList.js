import React from 'react';
import CarCard from './carCard';
import '../../css/components/carList.css';
import Stocklist from '../misc/stockList';
const CarList = ({ cars }) => {

  
  return (
    
    <Stocklist cars={cars} />
    /*  
    <div className="car-list">
    
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
    */
    
  );
};

export default CarList;
