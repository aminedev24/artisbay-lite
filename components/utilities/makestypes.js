import { useRouter } from "next/navigation";
import Link from "next/link";
import 'car-makes-icons/dist/style.css'; // Assuming this package provides make icons
import Image from 'next/image';
import ImageWithLoader from "../misc/imageWithLoader";
const Makestypes = () => {
  const router = useRouter();

  // Array for body types
  const bodyTypes = [
    {
      name: "Sedan",
      imgSrc: `/images/car-icons/sedan.png`,
      alt: "Sedan car icon"
    },
    {
      name: "Hatchback",
      imgSrc: `/images/car-icons/hatch.png`,
      alt: "Hatchback car icon"
    },
    {
      name: "SUV",
      imgSrc: `/images/car-icons/suv.png`,
      alt: "SUV car icon"
    },
    {
      name: "Wagon",
      imgSrc: `/images/car-icons/wagon.png`,
      alt: "Wagon car icon"
    },
    {
      name: "Van",
      imgSrc: `/images/car-icons/van.png`,
      alt: "Van car icon"
    },
    {
      name: "Truck",
      imgSrc: `/images/car-icons/truck.png`,
      alt: "Truck car icon"
    },
    {
      name: "Hybrid",
      imgSrc: `/images/car-icons/hybrid.png`,
      alt: "Hybrid car icon"
    },
    {
      name: "Mini",
      imgSrc: `/images/car-icons/mini.png`,
      alt: "Mini car icon"
    }
  ];

  // Array for makes
  const makes = [
    { name: "Toyota" },
    { name: "Nissan" },
    { name: "Honda" },
    { name: "Mazda" },
    { name: "Subaru" },
    { name: "Mitsubishi" },
    { name: "Suzuki" },
    { name: "Audi" },
    { name: "Isuzu" },
    { name: "Mercedes-Benz" },
    { name: "BMW" },
    { name: "Volkswagen" }
  ];

  const normalizeToken = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const makeAliases = {
    "mercedes benz": "MERCEDES BENZ",
    "mercedes-benz": "MERCEDES BENZ",
    volkswagen: "VOLKSWAGEN",
    audi: "AUDI",
    bmw: "BMW",
  };

  const bodyAliases = {
    suv: "SUV",
    van: "Van/Minivan",
    mini: "Kei Car",
  };

  // Popular models in the current stock. Each chip carries make + model so
  // the stock list opens already narrowed to exact matches.
  // Simplified from 10 to 6: the three Land Cruiser variants (Prado/250/bare)
  // were redundant clutter — Prado alone covers the intent — and Golf/Q5
  // were dropped in favor of keeping the set to one chip per make.
  const popularModels = [
    { make: "TOYOTA", model: "Land Cruiser Prado", label: "Land Cruiser Prado" },
    { make: "LEXUS", model: "RX", label: "Lexus RX" },
    { make: "PORSCHE", model: "Macan", label: "Porsche Macan" },
    { make: "PORSCHE", model: "911", label: "Porsche 911" },
    { make: "LAND ROVER", model: "Range Rover Evoque", label: "Range Rover Evoque" },
    { make: "AUDI", model: "Q5", label: "Audi Q5" },
  ];

  const handleFilterChange = (make, bodyType, model) => {
    const params = new URLSearchParams();
    if (make) {
      const normalizedMake = normalizeToken(make);
      params.set('make', makeAliases[normalizedMake] || make);
    }
    if (bodyType) {
      const normalizedBody = normalizeToken(bodyType);
      params.set('bodyType', bodyAliases[normalizedBody] || bodyType);
    }
    if (model) {
      params.set('model', model);
    }

    // Use navigate to change the URL
    router.push(`/stock-list?${params.toString()}`);
  };

  return (
    <div className="makes-wrapper">
    <ImageWithLoader className="title-img" src={`/images/vehiclesearchtitle.png`} alt="vehicle quick search"    />

    <div className="main-container">
       
      <div className="type-container">
        <h2 className="title">Body Type</h2>
        <div className="grid">
          {bodyTypes.map((type, index) => (
            <div className="grid-item" key={index} onClick={() => handleFilterChange(null, type.name)}>
              <ImageWithLoader alt={type.alt} src={type.imgSrc}   />
              <span>{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="make-container">
            <h2 className="title">Makes</h2>
            <div className="brands">
                {makes.map((make, index) => (
                    <div className="brand" key={index} onClick={() => handleFilterChange(make.name, null)}>
                        <ImageWithLoader src={`/images/makes/${make.name.toLowerCase()}-logo.png`} 
                            alt={make.name} 
                            className="make-icon"  
                             />
                        <p>{make.name}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>

    <div className="models-container">
      <h2 className="title">Popular Models</h2>
      {/*
        Deliberately simple, tiny cards — no vehicle thumbnail here. The
        featured-cars carousel just below already shows real vehicle
        photos, so repeating them here would just be redundant.
      */}
      <div className="model-chips">
        {popularModels.map((entry) => (
          <button
            type="button"
            className="model-chip"
            key={entry.label}
            onClick={() => handleFilterChange(entry.make, null, entry.model)}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Makestypes;