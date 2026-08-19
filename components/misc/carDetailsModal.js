// CarDetailsModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faGasPump, faTachometerAlt, faGaugeHigh, faUser, faEuroSign, faCog } from '@fortawesome/free-solid-svg-icons';
import { formatNumberWithUnit } from '../utilities/numberFormat';

// You MUST replace this placeholder with the actual path to your default image file.
const DEFAULT_IMAGE = '/path/to/placeholder/image.jpg'; 

const CarDetailsModal = ({ car, imgBasePath, onClose, onRequestInvoice }) => {
  if (!car) return null; // Don't render if no car data is provided

  // Use the API data with robust fallbacks
  const make = car.make || "N/A";
  const model = car.model || "Model N/A";
  const year = car.year || "N/A";
  const mileage = formatNumberWithUnit(car.mileage) || "N/A";
  const fuel = car.fuel || "N/A";
  const transmission = car.transmission || "N/A";
  const category = car.category || "N/A";
  const engineCapacity = formatNumberWithUnit(car.engine_capacity) || "N/A";
  const color = car.color || "N/A";
  const vin = car.vin_number || "N/A";
  const driveTrain = car.drive_train || "N/A";
  const doors = car.doors || "N/A";
  const condition = car.condition || "N/A";
  const currency = car.currency ? car.currency.toUpperCase() : "";
  const rawPrice = car.price ?? car.final_value ?? "";
  const priceValue = car.fob
  
  // Image URL Construction Logic
  const mainImagePath = (car.images && car.images.length > 0) ? car.images[0] : DEFAULT_IMAGE;
  const mainImageUrl = mainImagePath === DEFAULT_IMAGE 
    ? DEFAULT_IMAGE
    : `${imgBasePath}/${mainImagePath.startsWith('/') ? mainImagePath.substring(1) : mainImagePath}`;


  // --- Helper for Spec Display ---
  const SpecItem = ({ icon, label, value }) => (
    <div className="flex flex-col items-center p-3 border-r last:border-r-0">
      <FontAwesomeIcon icon={icon} className="text-[#f1892b] text-xl mb-1" />
      <span className="text-xs text-gray-500 uppercase">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white  shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-500 transition z-10 p-2 bg-white"
          aria-label="Close details"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        {/* Modal Header/Image */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={mainImageUrl}
            alt={`${make} ${model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
            <h2 className="text-3xl font-extrabold text-white">
              {make} {model}
            </h2>
            <p className="text-xl font-bold text-[#f1892b]">{priceValue.tolocaleString()} {currency}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Main Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-gray-200  divide-x divide-gray-200 text-center">
            <SpecItem icon={faCalendarAlt} label="Year" value={year} />
            <SpecItem icon={faTachometerAlt} label="Mileage" value={mileage} />
            <SpecItem icon={faGasPump} label="Fuel" value={fuel} />
            <SpecItem icon={faGaugeHigh} label="Trans" value={transmission} />
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Full Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              <p><span className="font-semibold text-gray-600">Category:</span> <span className="text-gray-900">{category}</span></p>
              <p><span className="font-semibold text-gray-600">Engine:</span> <span className="text-gray-900">{engineCapacity}</span></p>
              <p><span className="font-semibold text-gray-600">Drivetrain:</span> <span className="text-gray-900">{driveTrain}</span></p>
              <p><span className="font-semibold text-gray-600">Color:</span> <span className="text-gray-900">{color}</span></p>
              <p><span className="font-semibold text-gray-600">Doors:</span> <span className="text-gray-900">{doors}</span></p>
              <p><span className="font-semibold text-gray-600">Condition:</span> <span className="text-gray-900">{condition}</span></p>
              <p><span className="font-semibold text-gray-600">VIN:</span> <span className="text-gray-900">{vin}</span></p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => onRequestInvoice?.(car)}
              type="button"
              className="bg-[#304c9a] text-white text-lg font-bold py-3 px-8  hover:bg-[#253975] transition duration-200"
            >
              Request Invoice
            </button>
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-200 text-gray-800 text-lg font-semibold py-3 px-6  hover:bg-gray-300 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
