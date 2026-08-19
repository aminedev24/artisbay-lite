import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { normalizeValue } from "./invoiceUtils";
import { fetchMakes, fetchModelsForMake } from "../vehicles/vehicleData";

export default function useLineItems() {
  const [lineItems, setLineItems] = useState([
    { refNo: "", makerCarName: "", model: "", chassisNo: "", cc: "", door: "", seat: "",
      shift: "", year: "", color: "", mileage: "", fuelType: "", unitPrice: 0, freight: 0, insurance: 0, amount: 0 },
  ]);
  const [makes, setMakes] = useState([]);
  const [modelsByMake, setModelsByMake] = useState({});
  const modelsFetchCache = useRef(new Set());

  useEffect(() => {
    const loadMakes = async () => {
      try {
        const fetchedMakes = await fetchMakes();
        if (Array.isArray(fetchedMakes)) {
          setMakes(Array.from(new Set(fetchedMakes.map((m) => normalizeValue(m)).filter(Boolean))));
        }
      } catch (err) {
        console.error("Failed to load makes:", err);
      }
    };
    loadMakes();
  }, []);

  const loadModelsForMake = useCallback(async (make) => {
    const nm = normalizeValue(make);
    if (!nm || modelsFetchCache.current.has(nm)) return;
    modelsFetchCache.current.add(nm);
    try {
      const fetchedModels = await fetchModelsForMake(nm);
      if (Array.isArray(fetchedModels)) {
        const normalizedModels = fetchedModels.map((m) => normalizeValue(m)).filter(Boolean);
        setModelsByMake((prev) => {
          const existing = prev[nm] || [];
          return { ...prev, [nm]: Array.from(new Set([...normalizedModels, ...existing])) };
        });
      } else {
        modelsFetchCache.current.delete(nm);
      }
    } catch (err) {
      console.error(`Failed to load models for ${nm}:`, err);
      modelsFetchCache.current.delete(nm);
    }
  }, []);

  useEffect(() => {
    lineItems.forEach((item) => {
      const nm = normalizeValue(item.makerCarName);
      if (nm) loadModelsForMake(nm);
    });
  }, [lineItems, loadModelsForMake]);

  const handleLineItemChange = (index, field, value) => {
    const items = [...lineItems];
    if (!items[index]) return;
    const nv = field === "makerCarName" || field === "model" ? normalizeValue(value) : value;
    items[index] = { ...items[index], [field]: nv };
    if (["unitPrice", "freight", "insurance"].includes(field)) {
      const unitPrice = parseFloat(items[index].unitPrice) || 0;
      const freight = parseFloat(items[index].freight) || 0;
      const insurance = parseFloat(items[index].insurance) || 0;
      items[index].amount = (unitPrice + freight + insurance).toFixed(2);
    }
    setLineItems(items);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { refNo: "", makerCarName: "", model: "", chassisNo: "", cc: "", door: "",
      seat: "", shift: "", year: "", color: "", mileage: "", fuelType: "", unitPrice: 0, freight: 0, insurance: 0, amount: 0 }]);
  };

  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const setInitialLineItem = (carItem) => {
    setLineItems([carItem]);
  };

  const addMake = (make) => {
    const nm = normalizeValue(make);
    if (nm) setMakes((prev) => (prev.includes(nm) ? prev : [...prev, nm]));
  };

  const addModel = (make, model) => {
    const nm = normalizeValue(make);
    const mdl = normalizeValue(model);
    if (!nm || !mdl) return;
    setModelsByMake((prev) => {
      const existing = prev[nm] || [];
      if (existing.includes(mdl)) return prev;
      return { ...prev, [nm]: [...existing, mdl] };
    });
  };

  const makeOptions = useMemo(() => {
    const unique = Array.from(new Set(makes.map((m) => normalizeValue(m)).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b));
    return unique.map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase() }));
  }, [makes]);

  const getModelOptions = useCallback((make) => {
    const models = modelsByMake[make] || [];
    return Array.from(new Set(models.filter(Boolean)))
      .sort((a, b) => a.localeCompare(b))
      .map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase() }));
  }, [modelsByMake]);

  return {
    lineItems, setLineItems, handleLineItemChange, addLineItem, removeLineItem,
    setInitialLineItem, addMake, addModel, makes, setMakes, modelsByMake, setModelsByMake,
    loadModelsForMake, makeOptions, getModelOptions,
  };
}
