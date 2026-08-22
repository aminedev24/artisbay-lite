import React from "react";
import InventoryConsole from "./inventoryConsole";
import CarList from "../dataFetch/fetchStock";

function HomePage() {
  return (
    <div className="layout">
      <InventoryConsole />
      <CarList />
    </div>
  );
}

export default HomePage;
