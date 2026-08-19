import React from "react";
import { formatNumberWithUnit } from "../../../utilities/numberFormat";

const SoldCarDetailsGrid = ({ car, compact = false }) => {
  if (!car) return null;

  return (
    <div
      className={`grid gap-4 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-inner shadow-slate-100 ${
        compact ? "grid-cols-2 text-[0.8rem]" : "grid-cols-2 lg:grid-cols-4 text-sm"
      }`}
    >
      <div className='text-left'>
        <h4 className="font-semibold text-slate-700">Basic Info</h4>
        <p>Size: {car.size}</p>
        <p>Category: {car.category}</p>
        <p>Color: {car.color}</p>
        <p>Dimension: {car.dimension}</p>
        <p>M3: {car.m3}</p>
        <p>Invoice Date: {car.invoice_date || "N/A"}</p>
      </div>
      <div>
        <h4 className="font-semibold text-slate-700">Technical</h4>
        <p>Engine: {formatNumberWithUnit(car.engine_capacity)}</p>
        <p>Mileage: {formatNumberWithUnit(car.mileage)}</p>
        <p>Chassis: {car.chassis_no}</p>
        <p>Fuel: {car.fuel}</p>
        <p>Doors: {car.door}</p>
        <p>Seats: {car.seat}</p>
      </div>
      <div className='text-left'>
        <h4 className="font-semibold text-slate-700">Shipping</h4>
        <p>Ship: {car.ship_name}</p>
        <p>Departure: {car.departure_port}</p>
        <p>Arrival: {car.arrival_port}</p>
        <p>Freight: {car.freight || "N/A"}</p>
        <p>Discount: {car.discount || "N/A"}</p>
      </div>
      <div className='text-left'>
        <h4 className="font-semibold text-slate-700">User Info</h4>
        <p>User: {car.user_name}</p>
        <p>Phone: {car.phone}</p>
        <p>Address: {car.address}</p>
        <p>Company: {car.company}</p>
      </div>
    </div>
  );
};

export default SoldCarDetailsGrid;
