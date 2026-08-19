// pages/index.js
import { useState, useEffect } from 'react';
import HomePage from '../components/pages/homepage';
import carData from '../components/vehicles/carData';

import { Html, Head, Main, NextScript } from "next/document";

// If HomePage expects a prop `cars`, we do the same client-side load:
export default function IndexPage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    setCars(carData);
  }, []);

  return (
  
  <HomePage cars={cars}/>

  );
}
