import React, { useEffect, useState, useCallback, useMemo } from "react";
import { apiBaseUrl } from '../utilities/apiBase';
import CarCard from '../vehicles/carCard';

const TABS = [
  { id: 'new', label: 'New Arrivals' },
  { id: 'premium', label: 'Premium' },
  { id: 'hot', label: 'Hot Picks' },
  { id: 'all', label: 'All Stock' },
];

const HOT_MODELS = ['land cruiser', 'hilux', 'hiace', 'prado', 'x-trail', 'pajero', 'alphard', 'patrol', 'fortuner', 'navara'];

function scoreCar(car) {
  const s = String(car.grade || '').replace(/[^0-9.]/g, '');
  const grade = parseFloat(s) || 0;
  const mileage = parseInt(car.mileage) || 999999;
  const hot = HOT_MODELS.some((m) => (car.model || '').toLowerCase().includes(m));
  return hot ? grade + 10 : grade;
}

const SkeletonCard = () => (
  <div className="bg-[var(--white)] border border-[var(--border-color)] rounded overflow-hidden flex flex-col h-full min-w-0">
    <div className="relative h-32 overflow-hidden bg-gray-100">
      <div className="absolute inset-0 animate-pulse bg-gray-200" />
    </div>
    <div className="p-2.5 space-y-1.5 flex-1 min-h-0">
      <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
    </div>
    <div className="mx-2.5 mt-1 pt-2 border-t border-[var(--border-color)] grid grid-cols-2 gap-1.5">
      <div className="h-2 rounded bg-gray-200 animate-pulse" />
      <div className="h-2 rounded bg-gray-200 animate-pulse" />
      <div className="h-2 rounded bg-gray-200 animate-pulse" />
      <div className="h-2 rounded bg-gray-200 animate-pulse" />
    </div>
    <div className="px-2.5 pb-2.5 pt-1.5 mt-auto">
      <div className="h-6 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');

  const apiUrl = apiBaseUrl;

  useEffect(() => {
    fetch(`${apiUrl}/inventory/cars/fetchStock.php`)
      .then((res) => res.json())
      .then((data) => {
        setCars(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  const handleViewDetails = useCallback((car) => {
    if (!car) return;
    const identifier = car.ref_no || car.id || car.stock_no;
    if (!identifier) return;
    window.open(`/vehicle?id=${encodeURIComponent(String(identifier).trim())}`, '_blank', 'noopener');
  }, []);

  const tabbedCars = useMemo(() => {
    if (!cars.length) return { new: [], premium: [], hot: [], all: [] };
    const sortedNew = [...cars].sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    const sortedPremium = [...cars].sort((a, b) => (parseFloat(b.final_value || b.price || 0)) - (parseFloat(a.final_value || a.price || 0)));
    const hotByScore = [...cars].sort((a, b) => scoreCar(b) - scoreCar(a));
    return {
      new: sortedNew.slice(0, 9),
      premium: sortedPremium.slice(0, 9),
      hot: hotByScore.slice(0, 9),
      all: cars.slice(0, 9),
    };
  }, [cars]);

  const activeCars = tabbedCars[activeTab] || [];
  const activeCarsForGrid = useMemo(() => {
    if (!activeCars.length) return [];
    if (activeCars.length % 2 === 0) return activeCars;

    return [...activeCars, activeCars[activeCars.length - 1]];
  }, [activeCars]);

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="flex gap-0.5 mb-4 bg-gray-200 rounded p-0.5">
          {TABS.map((tab) => (
            <div key={tab.id} className="flex-1 py-2 rounded bg-gray-300/50 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`skel-${i}`}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cars.length === 0) return null;

  return (
    <div className="px-4 py-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-2xl font-bold text-[var(--primary-color)] tracking-tight">
          Latest Stock
        </h2>
        <a href="/stock-list" className="text-[11px] font-bold text-[var(--primary-color)] uppercase tracking-wider flex items-center gap-1 hover:underline">
          View All ({cars.length})
          <span className="text-[9px]">&rsaquo;</span>
        </a>
      </div>

      <div className="flex gap-0.5 mb-4 bg-gray-200 rounded p-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`flex-1 py-2 text-[11px] font-extrabold uppercase tracking-wider transition rounded ${
              activeTab === tab.id
                ? 'bg-white text-[var(--primary-color)] shadow-sm'
                : 'bg-transparent text-[var(--grey-text)] hover:text-[var(--text-color)]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {activeCarsForGrid.map((car, index) => (
          <div key={`${car.ref_no || car.id || car.stock_no || 'car'}-${index}`}>
            <CarCard car={car} onViewDetails={handleViewDetails} />
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <a href="/stock-list" className="inline-block bg-[var(--primary-color)] text-white py-2.5 px-8 text-sm font-extrabold uppercase tracking-wider rounded hover:opacity-90 transition">
          View All Stock ({cars.length} vehicles)
        </a>
      </div>
    </div>
  );
};

export default CarsList;
