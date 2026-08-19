import React, { useState } from "react";
import { useRouter } from "next/navigation";
import VehicleSelector from "../vehicles/vehicleSelector";
import Link from "next/link";
import ImageWithLoader from "./imageWithLoader";

const SearchForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    type: "",
    price: "",
    yearFrom: "",
    yearTo: "",
    transmission: "",
    fuelType: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        queryParams[key] = formData[key];
      }
    });
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/stock-list?${queryString}`);
  };

  return (
    <div className="search-container-wrapper">
      <div className="search-container">
        <h4>Search vehicles</h4>
        <form className="search-form" onSubmit={handleSubmit}>
          <VehicleSelector formData={formData} setFormData={setFormData} />
          <div className="form-group">
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="right-image shipping-banner">
        <ImageWithLoader src="/images/homepage/shipping.png" alt="shipping banner"     />
        <Link href="/shipping">
          <button className="shipping-btn">learn more</button>
        </Link>
      </div>
    </div>
  );
};

export default SearchForm;