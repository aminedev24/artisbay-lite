// stockList.js
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faStar, faPercentage } from "@fortawesome/free-solid-svg-icons";
import ReactCountryFlag from "react-country-flag";
import CarCard from "../vehicles/carCard";
// IMPORT THE NEW MODAL COMPONENT
import CarDetailsModal from "./CarDetailsModal"; // Assuming CarDetailsModal.js is in the same directory or accessible path
// import styles from '../../styles/custom/utilities/stockList.module.css';
import { localServicesCountries } from "../utilities/localServicesCountries";
import { apiBaseUrl } from '../utilities/apiBase';

const Stocklist = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- New State for Data and Loading ---
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW STATE FOR MODAL ---
  const [selectedCar, setSelectedCar] = useState(null); // Stores the car object for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal visibility
  // -------------------------

  // --- API URL Definition (Copied from adminSoldCars) ---
  const apiUrl = apiBaseUrl;
      
  const imgBasePath = apiUrl;
  // -----------------------------------

  // Hardcoded options
  const [sortOption] = useState("newest");
  const [viewOption] = useState("grid");
  const ITEMS_PER_PAGE = 6;
  const MAX_PAGE_BUTTONS = 4;
  const itemsPerPage = ITEMS_PER_PAGE;
  const maxPageButtons = MAX_PAGE_BUTTONS;
  const [currentPage, setCurrentPage] = useState(1);

  const selectedMake = searchParams.get("make");
  const selectedBodyType = searchParams.get("bodyType");
  const selectedPrice = searchParams.get("price");
  const searchKeyword = searchParams.get("search");
  const normalizeText = (value) =>
    typeof value === "string"
      ? value.toLowerCase()
      : value != null
      ? String(value).toLowerCase()
      : "";

  // --- MODAL HANDLER FUNCTIONS ---
  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null); // Clear the car data when closing
  };
  // -----------------------------

  const handleRequestInvoice = useCallback(
    (car) => {
      if (typeof window === "undefined") {
        return;
      }

      const normalizeAmount = (value) => {
        if (value === null || value === undefined) {
          return "";
        }

        const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
        return Number.isFinite(numeric) ? numeric : "";
      };

      const invoicePayload = {
        make: car.make || "",
        model: car.model || "",
        vehicle_ref: car.ref_no || car.id || "",
        vehicle_description: [car.year, car.make, car.model]
          .filter(Boolean)
          .join(" "),
        engine_capacity: car.engine_capacity || "",
        mileage: car.mileage || "",
        chasis_number:
          car.chassis_no || car.chassisNumber || car.chassis || car.vin_number || "",
        deposit_amount: normalizeAmount(car.final_value ?? car.price),
        deposit_currency: (car.currency || "JPY").toUpperCase(),
        deposit_purpose: "order vehicle",
        description:
          car.description ||
          `Payment for ${[car.year, car.make, car.model]
            .filter(Boolean)
            .join(" ")}`,
      };

      const payloadString = JSON.stringify(invoicePayload);

      try {
        sessionStorage.setItem("invoiceData", payloadString);
      } catch (error) {
        console.error("Failed to cache invoice data for generator:", error);
      }

      try {
        localStorage.setItem("invoiceData", payloadString);
      } catch (error) {
        console.error("Failed to persist invoice data for new window:", error);
      }

      setIsModalOpen(false);
      setSelectedCar(null);

      const targetUrl = "/invoice-generator?regenerate=false";
      if (typeof window !== "undefined") {
        const opened = window.open(targetUrl, "_blank", "noopener,noreferrer");
        if (!opened) {
          router.push(targetUrl);
        }
      } else {
        router.push(targetUrl);
      }
    },
    [router],
  );

  // --- Data Fetching Effect (Includes Data Normalization Fix) ---
  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/inventory/tires/fetchStock.php`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // FIX: Normalize the data to ensure 'images' property is an array for CarCard.
        const normalizedData = data.map(car => {
          let imagesArray = [];
          if (car.image_urls) {
            try {
              // Try to parse the string "[]" or JSON string of URLs
              imagesArray = JSON.parse(car.image_urls);
            } catch (e) {
              // If JSON parsing fails, assume it's invalid for this component.
              imagesArray = []; 
            }
          }
          
          return {
            ...car,
            // Ensure the key passed to CarCard is 'images' and it's always an array
            images: Array.isArray(imagesArray) ? imagesArray : [] 
          };
        });
        
        setCars(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  // --- Filtering Logic (Adapted to API keys) ---
  const filterByPrice = (price, selectedPrice) => {
    switch (selectedPrice) {
      case "under500":
        return price < 500;
      case "under1000":
        return price < 1000;
      case "under1500":
        return price < 1500;
      case "under2000":
        return price < 2000;
      case "under2500":
        return price < 2500;
      default:
        return true;
    }
  };

  const filteredCars = useMemo(() => {
    const normalizedSelectedMake = normalizeText(selectedMake);
    const normalizedSelectedBodyType = normalizeText(selectedBodyType);
    const normalizedSearch = normalizeText(searchKeyword);

    return cars.filter((car) => {
      const carMake = normalizeText(car.make);
      const carBodyType = normalizeText(car.category);
      const carModel = normalizeText(car.model);

      const makeMatch = selectedMake ? carMake === normalizedSelectedMake : true;
      const bodyTypeMatch = selectedBodyType
        ? carBodyType === normalizedSelectedBodyType
        : true;
      const priceMatch = selectedPrice
        ? filterByPrice(car.final_value ? Number(car.final_value) : 0, selectedPrice)
        : true;
      const searchMatch = normalizedSearch
        ? [carMake, carBodyType, carModel].some((field) =>
            field.includes(normalizedSearch)
          )
        : true;
      return makeMatch && bodyTypeMatch && priceMatch && searchMatch;
    });
  }, [cars, selectedMake, selectedBodyType, selectedPrice, searchKeyword]);

  const sortedCars = useMemo(() => {
    return [...filteredCars].sort((a, b) => {
      switch (sortOption) {
        case "price":
          return (Number(a.final_value) || 0) - (Number(b.final_value) || 0);
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        case "newest":
        default:
          return new Date(b.ship_date).getTime() - new Date(a.ship_date).getTime();
      }
    });
  }, [filteredCars, sortOption]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 200);
    }
  }, [searchParams.toString()]);

  const filtersSignature = useMemo(
    () =>
      [
        selectedMake || "",
        selectedBodyType || "",
        selectedPrice || "",
        searchKeyword || "",
      ].join("|"),
    [selectedMake, selectedBodyType, selectedPrice, searchKeyword]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filtersSignature, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedCars.length / itemsPerPage));
  }, [sortedCars.length, itemsPerPage]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCars.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCars, currentPage, itemsPerPage]);

  const visiblePageNumbers = useMemo(() => {
    const total = totalPages;
    const maxButtons = Math.max(1, maxPageButtons);

    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const half = Math.floor(maxButtons / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = start + maxButtons - 1;
    } else if (end > total) {
      end = total;
      start = end - maxButtons + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, maxPageButtons, totalPages]);

  const goToPage = (page) => {
    setCurrentPage((prev) => {
      const nextPage = Math.min(Math.max(page, 1), totalPages);
      return prev === nextPage ? prev : nextPage;
    });
  };

  const handleFilterChange = (make, bodyType) => {
    const params = new URLSearchParams(searchParams.toString());

    if (make) params.set("make", make);
    else params.delete("make");

    if (bodyType) params.set("bodyType", bodyType);
    else params.delete("bodyType");

    if (searchKeyword) params.set("search", searchKeyword);

    router.push(`/stocklist?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#304c9a]"></div>
        <p className="ml-4 text-xl text-[#304c9a] font-semibold">Loading Stock...</p>
      </div>
    );
  }

  return (
    <div className="px-4 flex-1 max-w-[1500px] mx-auto">
      {/* New Arrivals Section */}
      <div className="bg-gray-50 rounded-lg p-5 my-5 shadow-md">
        {/* Buttons Row */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
          <button
            className="bg-white text-[#304c9a] border rounded px-4 py-2 uppercase font-bold flex items-center justify-center gap-2 hover:bg-[#f1892b] hover:text-white transition"
            onClick={() => handleFilterChange("Toyota", null)}
          >
            <FontAwesomeIcon icon={faCar} /> New Arrival
          </button>
          <button
            className="bg-white text-[#304c9a] border rounded px-4 py-2 uppercase font-bold flex items-center justify-center gap-2 hover:bg-[#f1892b] hover:text-white transition"
            onClick={() => handleFilterChange("Honda", null)}
          >
            <FontAwesomeIcon icon={faStar} /> Premium Class
          </button>
          <button
            className="bg-white text-[#304c9a] border rounded px-4 py-2 uppercase font-bold flex items-center justify-center gap-2 hover:bg-[#f1892b] hover:text-white transition"
            onClick={() => handleFilterChange(null, "Hatchback")}
          >
            <FontAwesomeIcon icon={faPercentage} /> Discounted Stock
          </button>
        </div>

        <h4 className="text-lg font-semibold text-gray-700 mb-3">
          From our partners:
        </h4>
        <div className="flex flex-wrap justify-center gap-2 mx-auto w-full sm:w-3/5">
          {localServicesCountries.map((country, index) => (
            <button
              key={index}
              className="bg-white text-[#304c9a] border rounded px-5 py-2 uppercase flex items-center gap-2 hover:bg-[#f1892b] hover:text-white transition"
            >
              {country.code && (
                <ReactCountryFlag
                  countryCode={country.code}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                  title={country.name}
                />
              )}
              {country.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div
          className={`w-full ${
            sortedCars.length === 0
              ? "flex items-center justify-center min-h-[300px]"
              : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {sortedCars.length > 0 ? (
            // PASSING THE BASE PATH AND THE NEW onViewDetails PROP TO CARCARD
            paginatedCars.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                imgBasePath={imgBasePath} 
                onViewDetails={handleViewDetails} // ADDED PROP
                onRequestInvoice={handleRequestInvoice}
              />
            ))
          ) : (
            <span className="font-bold text-2xl text-[color:var(--accent-color)] bg-[color:var(--background-color)] px-6 py-4 rounded">
              No stock
            </span>
          )}
        </div>
        {sortedCars.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm text-gray-600">
              Showing{" "}
              <strong>
                {Math.min((currentPage - 1) * itemsPerPage + 1, sortedCars.length)}
              </strong>{" "}
              -{" "}
              <strong>
                {Math.min(currentPage * itemsPerPage, sortedCars.length)}
              </strong>{" "}
              of <strong>{sortedCars.length}</strong> vehicles
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded border border-gray-300 text-sm font-semibold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {visiblePageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`min-w-[2.25rem] px-3 py-1 rounded border text-sm font-semibold transition ${
                    currentPage === pageNumber
                      ? "bg-[#304c9a] border-[#304c9a] text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => goToPage(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className="px-3 py-1 rounded border border-gray-300 text-sm font-semibold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            <span className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
      {isModalOpen && selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          imgBasePath={imgBasePath}
          onClose={handleCloseModal}
          onRequestInvoice={handleRequestInvoice}
        />
      )}
    </div>
  );
};

export default Stocklist;