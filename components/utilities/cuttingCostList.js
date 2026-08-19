// StaticCostList.js
import React from "react";
import Tooltip from "./toolTip";

const StaticCostList = () => {
  // Hard-coded values
  const buyingPrice = 500000; // Example vehicle price
  const auctionFees = 20000;
  const transportation = 15000;
  const cuttingFee = 30000;
  const serviceFees = 20000;
  const optionalFees = 12000;
  const units = 3;
  const taxRate = 0.1;

  // Calculations based on hard-coded values
  const tax = (buyingPrice + auctionFees + transportation) * taxRate;
  const feesPerVehicle = auctionFees + transportation + tax + cuttingFee + serviceFees + optionalFees;
  const vehicleCost = buyingPrice + auctionFees + tax + cuttingFee + serviceFees + optionalFees;
  const totalFeesAllVehicles = feesPerVehicle * units;
  const totalCostAllVehicles = vehicleCost * units;

  return (
    <div className="cost-breakdown">
      <h3>Cost Breakdown Example</h3>
      
      <div className="breakdown-item">
        <span>Vehicle Price</span>
        <span>¥{buyingPrice.toLocaleString()}</span>
      </div>
      
      <div className="breakdown-item">
        <span>Auction Fees</span>
        <span>¥{auctionFees.toLocaleString()}</span>
      </div>
      
      <div className="breakdown-item">
        <span>Transportation Fees</span>
        <span>¥{transportation.toLocaleString()}</span>
      </div>
      
      <div className="breakdown-item">
        <span>Tax (10%)</span>
        <span>¥{tax.toLocaleString()}</span>
      </div>
      
      <div className="breakdown-item">
        <span>Cutting Fee</span>
        <span>¥{cuttingFee.toLocaleString()}</span>
      </div>
      
      <div className="breakdown-item">
        <span>Service Fees</span>
        <span>¥{serviceFees.toLocaleString()}</span>
      </div>
      
      <div className="breakdown-item">
        <span>Optional Removals</span>
        <span>¥{optionalFees.toLocaleString()}</span>
      </div>

      <div className="breakdown-item highlighted">
        <span>
          Fees per vehicle
          <Tooltip message="Includes: Auction Fees, Transportation, Tax, Cutting Fee, Service Fees, and Optional Removals" />
        </span>
        <span>¥{feesPerVehicle.toLocaleString()}</span>
      </div>

      <div className="breakdown-item highlighted">
        <span>
          Vehicle cost
          <Tooltip message="Vehicle price plus all fees except transportation" />
        </span>
        <span>¥{vehicleCost.toLocaleString()}</span>
      </div>

      <div className="breakdown-item highlighted">
        <span>
          Total fees (all vehicles)
          <Tooltip message="Fees per vehicle multiplied by number of units" />
        </span>
        <span>¥{totalFeesAllVehicles.toLocaleString()}</span>
      </div>

      <div className="total-cost grand-total">
        <span>
          Total cost (all vehicles)
          <Tooltip message="Total vehicle costs including all fees and optional items" />
        </span>
        <span>¥{totalCostAllVehicles.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default StaticCostList;