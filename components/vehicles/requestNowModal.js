import React, { useEffect, useMemo, useState, useCallback } from "react";
import { apiBaseUrl } from "../utilities/apiBase";
import { useUser } from "../user/userContext";
import { normalizeCurrency } from "../utilities/ichinomiyaCardAdapter";

const PLACEHOLDER_IMAGE = "/images/vehicles/artisbay-placeholder.svg";
const HELP_URL = "/help/how-to-buy-used-cars/";

// Minimal country/port/delivery rules based on provided guidance.
const countryPortRules = [
  {
    country: "Tanzania",
    ports: ["Dar es Salaam"],
    deliveryOptions: ["Deliver inside Tanzania"],
    inspectionRequired: true,
    paymentMode: "C&F available (freight known)",
    note: "Inspection is mandatory for Tanzania (Dar es Salaam).",
  },
  {
    country: "DRC",
    ports: ["Dar es Salaam"],
    deliveryOptions: ["Deliver to DRC via Dar es Salaam"],
    inspectionRequired: false,
    paymentMode: "C&F available (freight known)",
    note: "Dar es Salaam routes to DRC.",
  },
  {
    country: "Burundi",
    ports: ["Dar es Salaam"],
    deliveryOptions: ["Deliver to Burundi via Dar es Salaam"],
    inspectionRequired: false,
    paymentMode: "C&F available (freight known)",
    note: "Dar es Salaam routes to Burundi.",
  },
  {
    country: "Malawi",
    ports: ["Dar es Salaam"],
    deliveryOptions: ["Deliver to Malawi via Dar es Salaam"],
    inspectionRequired: false,
    paymentMode: "C&F available (freight known)",
    note: "Dar es Salaam routes to Malawi.",
  },
  {
    country: "Namibia",
    ports: ["Walvis Bay"],
    deliveryOptions: ["Pickup at Walvis Bay"],
    inspectionRequired: false,
    fobOnly: true,
    paymentMode: "FOB only (container freight confirmed on plan)",
    note: "C&F price requires a container plan confirmation.",
  },
  {
    country: "Congo (Matadi)",
    ports: ["Matadi"],
    deliveryOptions: ["Pickup at Matadi"],
    inspectionRequired: false,
    fobOnly: true,
    paymentMode: "FOB only (no RoRo)",
    note: "Matadi is container-only; no RoRo. Freight confirmed with container plan.",
  },
];

const fallbackCountry = "International";

const detectCountryBrowserHints = () => {
  if (typeof window === "undefined") return fallbackCountry;
  const language = navigator.language || "";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const lowerLang = language.toLowerCase();
  if (lowerLang.includes("tz")) return "Tanzania";
  if (lowerLang.includes("na")) return "Namibia";
  if (lowerLang.includes("cd") || lowerLang.includes("cg")) return "DRC";
  if (lowerLang.includes("bi")) return "Burundi";
  if (lowerLang.includes("mw")) return "Malawi";
  if (timeZone.toLowerCase().includes("africa")) {
    if (timeZone.toLowerCase().includes("nairobi")) return "Tanzania";
    if (timeZone.toLowerCase().includes("maputo")) return "Malawi";
    if (timeZone.toLowerCase().includes("lubumbashi") || timeZone.toLowerCase().includes("kinshasa")) return "DRC";
    if (timeZone.toLowerCase().includes("harare")) return "Namibia";
  }
  return fallbackCountry;
};

const fetchClientGeo = async () => {
  if (typeof window === "undefined") return null;
  const endpoints = ["https://ipapi.co/json/", "https://ipwho.is/"];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      const country = data?.country_name || data?.country || data?.countryName;
      if (country) return country;
    } catch (err) {
      // continue to next endpoint
    }
  }
  return null;
};

const buildInvoicePayload = (car, percentageLabel, percentageValue, selection) => {
  const baseAmountRaw = car?.fob ?? car?.final_value ?? car?.price ?? null;
  const numericBase = Number(String(baseAmountRaw || "").replace(/[^\d.-]/g, ""));
  const baseAmount = Number.isFinite(numericBase) ? numericBase : 0;
  const depositAmount =
    percentageValue === 1
      ? baseAmount
      : Number((baseAmount * percentageValue).toFixed(2));

  return {
    make: car?.make || "",
    model: car?.model || "",
    vehicle_ref: car?.ref_no || car?.id || "",
    vehicle_description: [car?.year, car?.make, car?.model].filter(Boolean).join(" "),
    engine_capacity: car?.engine_capacity || "",
    mileage: car?.mileage || "",
    chasis_number: car?.chassis_no || car?.chassisNumber || car?.vin_number || "",
    deposit_amount: depositAmount,
    deposit_currency: normalizeCurrency(car),
    deposit_purpose: "Paying My Vehicle",
    description:
      car?.description ||
      `Payment (${percentageLabel}) for ${[car?.year, car?.make, car?.model].filter(Boolean).join(" ")}`,
    delivery_country: selection?.country || "",
    delivery_port: selection?.port || "",
    delivery_option: selection?.delivery || "",
    inspection_required: Boolean(selection?.inspection),
    payment_plan: percentageLabel,
  };
};

const RequestNowModal = ({ car, onRedirectInvoice }) => {
  const { user } = useUser?.() || { user: null };
  const [detectedCountry, setDetectedCountry] = useState(fallbackCountry);
  const [country, setCountry] = useState(fallbackCountry);
  const [port, setPort] = useState("");
  const [delivery, setDelivery] = useState("");
  const [inspectionRequired, setInspectionRequired] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);

  const availableCountries = useMemo(
    () => [fallbackCountry, ...countryPortRules.map((c) => c.country)],
    []
  );

  const activeRule = useMemo(
    () => countryPortRules.find((rule) => rule.country === country),
    [country]
  );

  useEffect(() => {
    let mounted = true;
    const browserDetected = detectCountryBrowserHints();
    setDetectedCountry(browserDetected);
    setCountry(browserDetected);

    const detect = async () => {
      setLoadingGeo(true);
      try {
        // Try client-side IP lookup first for actual visitor location
        const clientCountry = await fetchClientGeo();
        if (mounted && clientCountry) {
          setDetectedCountry(clientCountry);
          setCountry(clientCountry);
          return;
        }

        // Fallback to server-side lookup (may reflect server IP)
        const res = await fetch(`${apiBaseUrl}/api/geo-detect.php`);
        if (!res.ok) throw new Error("Geo lookup failed");
        const data = await res.json();
        if (!mounted) return;
        const fromApi = data?.countryName || data?.country || browserDetected;
        setDetectedCountry(fromApi);
        setCountry(fromApi);
      } catch (err) {
        console.warn("Geo detection failed, falling back to browser hints", err);
        if (mounted) {
          setDetectedCountry(browserDetected);
          setCountry(browserDetected);
        }
      } finally {
        mounted && setLoadingGeo(false);
      }
    };

    detect();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeRule) {
      setPort(activeRule.ports[0] || "");
      setDelivery((activeRule.deliveryOptions && activeRule.deliveryOptions[0]) || "");
      setInspectionRequired(Boolean(activeRule.inspectionRequired));
    } else {
      setPort("");
      setDelivery("");
      setInspectionRequired(false);
    }
  }, [activeRule]);

  const handleAction = useCallback(
    async (label, percent) => {
      if (!car) return;
      const resolvedCountry = country || detectedCountry || fallbackCountry;
      const rule = countryPortRules.find((r) => r.country === resolvedCountry);
      const resolvedPort = port || rule?.ports?.[0] || "Unspecified";
      const resolvedDelivery =
        delivery || (rule?.deliveryOptions && rule.deliveryOptions[0]) || "Unspecified";
      const resolvedInspection = rule?.inspectionRequired ? true : inspectionRequired;

      const selection = {
        country: resolvedCountry,
        port: resolvedPort,
        delivery: resolvedDelivery,
        inspection: resolvedInspection,
      };

      const payload = buildInvoicePayload(car, label, percent, selection);
      // Reserve the car server-side if possible
      try {
        const res = await fetch(`${apiBaseUrl}/reservations/create_reservation.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicle_ref: car?.ref_no || car?.id || "",
            make: car?.make || "",
            model: car?.model || "",
            payment_plan: label,
            country: resolvedCountry,
            port: resolvedPort,
            delivery: resolvedDelivery,
            inspection_required: selection.inspection,
            deposit_amount: payload.deposit_amount,
            deposit_currency: payload.deposit_currency,
            deposit_purpose: payload.deposit_purpose || "Paying My Vehicle",
            user_full_name: user?.full_name || "",
            user_email: user?.email || "",
            user_id: user?.id || user?.uid || "",
          }),
          credentials: "include",
        });
        const result = await res.json().catch(() => ({}));
        if (result?.status === "duplicate") {
          window.alert("This vehicle is already reserved for your account.");
          return;
        }
        if (!res.ok) {
          console.warn("Reservation failed:", result);
        }
      } catch (error) {
        console.warn("Reservation attempt failed (continuing to invoice):", error);
      }

      try {
        sessionStorage.setItem("invoiceData", JSON.stringify(payload));
      } catch (error) {
        console.error("Failed to cache invoice data:", error);
      }
      if (typeof window !== "undefined") {
        window.location.href = "/invoice-generator?regenerate=false";
      }
      if (typeof onRedirectInvoice === "function") {
        onRedirectInvoice(payload);
      }
    },
    [car, country, port, delivery, inspectionRequired, onRedirectInvoice]
  );

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                Request Now
              </p>
              <h2 className="text-xl font-bold text-gray-900">
                Reserve & arrange payment for {car?.year} {car?.make} {car?.model}
              </h2>
            </div>
            <div className="text-xs text-gray-600">
              Detected country:{" "}
              <span className="font-semibold text-gray-900">{detectedCountry}</span>
              {loadingGeo && <span className="ml-2 text-[10px] text-gray-500">detecting…</span>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-gray-700">Destination country</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[#203e79] focus:outline-none"
              >
                {availableCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-gray-700">Port</span>
              <select
                value={port}
                onChange={(e) => setPort(e.target.value)}
                disabled={!activeRule}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 disabled:bg-gray-100 focus:border-[#203e79] focus:outline-none"
              >
                {activeRule?.ports?.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                )) || <option value="">Select destination</option>}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-gray-700">Delivery</span>
              <select
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                disabled={!activeRule}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 disabled:bg-gray-100 focus:border-[#203e79] focus:outline-none"
              >
                {activeRule?.deliveryOptions?.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                )) || <option value="">Select destination</option>}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inspectionRequired}
                onChange={(e) => setInspectionRequired(e.target.checked)}
                disabled={Boolean(activeRule?.inspectionRequired)}
              />
              <span>
                Inspection {activeRule?.inspectionRequired ? "(mandatory)" : "(optional)"}
              </span>
            </label>
            {activeRule?.paymentMode && (
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[#203e79] font-semibold">
                {activeRule.paymentMode}
              </span>
            )}
            {activeRule?.note && (
              <span className="text-xs text-red-600 font-semibold">{activeRule.note}</span>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-gray-300 bg-[#f9fbff] p-4 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Payment & delivery summary</p>
              <button
                type="button"
                onClick={() => handleAction("Ask a CTN", 0.2)}
                className="rounded-md border border-[#203e79] px-3 py-1 text-xs font-semibold text-[#203e79] hover:bg-[#203e79] hover:text-white"
              >
                Ask A CTN
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>Country: {country}</li>
              <li>Port: {port || activeRule?.ports?.[0] || "Select a port"}</li>
              <li>Delivery: {delivery || activeRule?.deliveryOptions?.[0] || "Select delivery option"}</li>
              <li>
                Inspection:{" "}
                {activeRule?.inspectionRequired
                  ? "Required"
                  : inspectionRequired
                  ? "Requested"
                  : "Not required"}
              </li>
              {activeRule?.fobOnly && (
                <li className="text-red-600 font-semibold">
                  FOB only. C&F requires container plan confirmation.
                </li>
              )}
              {!activeRule?.fobOnly && port && (
                <li className="text-red-600 font-semibold">
                  C&F available when freight is confirmed. Ask a CTN if you need a container plan.
                </li>
              )}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => handleAction("Reserve (Deposit)", 0.2)}
              className="rounded-md bg-[#203e79] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#162d5c]"
            >
              Reserve / Deposit
            </button>
            <button
              type="button"
              onClick={() => handleAction("Pay 50%", 0.5)}
              className="rounded-md bg-[#f1892b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d97824]"
            >
              Pay 50%
            </button>
            <button
              type="button"
              onClick={() => handleAction("Pay 100%", 1)}
              className="rounded-md border border-[#203e79] px-4 py-3 text-sm font-semibold text-[#203e79] transition hover:bg-[#203e79] hover:text-white"
            >
              Pay 100%
            </button>
          </div>

          <div className="flex items-center justify-between rounded-md border border-[#203e79]/20 bg-[#eef2ff] px-4 py-3 text-sm text-[#203e79]">
            <p className="font-semibold">
              Ask A CTN to reserve your spot and lock the vehicle while you complete payment.{" "}
              <a
                href={HELP_URL}
                className="underline decoration-[#203e79] decoration-2 underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                See the help page
              </a>{" "}
              for details.
            </p>
            <button
              type="button"
              onClick={() => handleAction("Ask a CTN", 0.2)}
              className="rounded-md bg-[#203e79] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#162d5c]"
            >
              Ask A CTN
            </button>
          </div>
      </div>
    </div>
  );
};



export default RequestNowModal;
