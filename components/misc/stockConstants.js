export const defaultFilterState = {
  make: 'All Makes',
  model: 'All Models',
  minPrice: 'No Min',
  maxPrice: 'No Max',
  yearFrom: 'Any',
  yearTo: 'Any',
  bodyType: 'All Types',
  fuel: 'All',
  transmission: 'All',
  steering: 'All',
  chassis: '',
  grade: 'All',
  mileage: 'All',
};

export const priceFilterOptions = [
  { label: "Any budget", value: "" },
  { label: "Entry (≤$500)", value: "under500" },
  { label: "Budget (≤$1,000)", value: "under1000" },
  { label: "Popular (≤$1,500)", value: "under1500" },
  { label: "Premium (≤$2,000)", value: "under2000" },
  { label: "Executive (≤$2,500)", value: "under2500" },
];

export const filterOptions = {
  makes: ['All Makes', 'Toyota', 'Nissan', 'Honda', 'Mitsubishi', 'Mazda', 'Subaru', 'Suzuki', 'Daihatsu', 'Isuzu', 'Hino', 'Lexus', 'Mercedes Benz', 'BMW', 'Audi', 'Volkswagen', 'Land Rover', 'Volvo', 'Ford', 'Chevrolet', 'Jeep', 'Hyundai', 'KIA', 'Renault', 'Peugeot', 'Fiat', 'Jaguar', 'Mini', 'Porsche'],
  models: ['All Models'],
  years: ['Any', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'],
  minPrices: ['No Min', '$500', '$1,000', '$2,500', '$5,000', '$10,000'],
  maxPrices: ['No Max', '$1,000', '$2,500', '$5,000', '$10,000', '$20,000'],
  bodyTypes: ['All Types', 'Sedan', 'SUV', 'Van/Minivan', 'Kei Car', 'Hatchback', 'Truck', 'Wagon', 'Coupe', 'Convertible', 'Bus'],
  fuels: ['All', 'Gasoline', 'Diesel', 'Hybrid', 'Electric', 'LPG'],
  transmissions: ['All', 'AT', 'CVT', 'MT'],
  steerings: ['All', 'Right Hand Drive', 'Left Hand Drive'],
  grades: ['All', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 4.5', 'Grade 5'],
  mileages: ['All', 'Under 30,000 km', 'Under 50,000 km', 'Under 80,000 km', 'Under 100,000 km', 'Over 100,000 km'],
};

export const sortSelections = [
  { value: "newest", label: "New Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_new", label: "Year: New to Old" },
  { value: "year_old", label: "Year: Old to New" },
  { value: "mileage_asc", label: "Mileage: Low to High" },
  { value: "mileage_desc", label: "Mileage: High to Low" },
];

export const quickFilterPresets = [
  { title: "SUVs", filters: { bodyType: "SUV" } },
  { title: "Hatchbacks", filters: { bodyType: "Hatchback" } },
  { title: "Sedans", filters: { bodyType: "Sedan" } },
  { title: "Trucks", filters: { bodyType: "Truck" } },
  { title: "Vans", filters: { bodyType: "Van/Minivan" } },
  { title: "Kei Cars", filters: { bodyType: "Kei Car" } },
];

export const controlledFilterKeys = [
  "make", "model", "bodyType", "fuel", "yearFrom", "yearTo",
  "minPrice", "maxPrice", "transmission", "steering", "chassis",
  "grade", "mileage", "search",
];

export const PAGE_SIZE_OPTIONS = [12, 24, 48, 72];

export const KEYWORD_ALIASES = {
  'automatic': 'at', 'auto': 'at', 'cvt': 'cvt', 'manual': 'mt', 'stick': 'mt',
  '4x4': '4wd', 'four wheel': '4wd', 'awd': '4wd', 'fwd': '2wd', 'rwd': '2wd',
  'petrol': 'gasoline', 'gas': 'gasoline', 'diesel': 'diesel', 'hybrid': 'hybrid',
  'ev': 'electric', 'electric': 'electric',
  'hatch': 'hatchback', 'minivan': 'van/minivan', 'mpv': 'van/minivan',
  'pickup': 'truck', 'kei': 'kei car',
  'rhd': 'right hand', 'lhd': 'left hand',
  'land cruiser': 'land cruiser', 'landcruiser': 'land cruiser',
  'lc': 'land cruiser', 'prado': 'land cruiser prado',
  'hilux': 'hilux', 'vigo': 'hilux', 'revo': 'hilux',
  'hiace': 'hiace', 'commuter': 'hiace',
  'alphard': 'alphard', 'vellfire': 'vellfire',
  'xtrail': 'x-trail', 'x-trail': 'x-trail',
  'patrol': 'patrol', 'safari': 'safari',
  'pajero': 'pajero', 'montero': 'pajero',
  'delica': 'delica', 'outlander': 'outlander',
  'cx-5': 'cx-5', 'cx5': 'cx-5',
  'forester': 'forester', 'impreza': 'impreza', 'outback': 'outback',
  'swift': 'swift', 'jimny': 'jimny',
  'd-max': 'd-max', 'dmax': 'd-max',
};
