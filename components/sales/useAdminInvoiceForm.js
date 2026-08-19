import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { normalizeValue } from "./invoiceUtils";
import CountryList from "../utilities/countryList";
import useCustomerFields from "./useCustomerFields";
import useLineItems from "./useLineItems";
import useInvoiceSubmission from "./useInvoiceSubmission";

export default function useAdminInvoiceForm() {
  const router = useRouter();
  const { carData: carDataQuery } = router.query;
  const carData = carDataQuery ? JSON.parse(carDataQuery) : null;

  const cust = useCustomerFields();
  const line = useLineItems();
  const submit = useInvoiceSubmission(cust, line);

  // Auto-fill form when carData arrives
  useEffect(() => {
    if (!carData) return;
    const fillForm = async () => {
      const opts = cust.options.length > 0 ? cust.options : await cust.fetchUserOptions();
      const matched = opts.find((o) => o.id === carData.user_id);

      if (matched) {
        cust.setCustomerName(matched.full_name || matched.customer_name || "");
        cust.setCustomerAddress(matched.address || matched.consignee_address || "");
        cust.setCustomerPhone(matched.phone || matched.tel1 || "");
        cust.setBillToName(matched.company || matched.full_name || "");
        cust.setBillToAddress(matched.address || matched.consignee_address || "");
        cust.setBillToPhone(matched.phone || matched.tel1 || "");
        cust.setConsigneeName(matched.full_name || matched.customer_name || "");
        cust.setConsigneeAddress(matched.address || matched.consignee_address || "");
        cust.setConsigneePhone(matched.phone || matched.tel1 || "");
        cust.setConsigneeEmail(matched.email || "");
        cust.setNotifyName(matched.full_name || matched.customer_name || "");
        cust.setNotifyAddress(matched.address || matched.notify_address || "");
        cust.setNotifyPhone(matched.phone || matched.notify_tel || "");
        cust.setNotifyEmail(matched.email || matched.notify_email || "");
        if (matched.country) {
          const countryObj = CountryList().find(
            (c) => c.value.toLowerCase() === matched.country.toLowerCase() || c.label.toLowerCase() === matched.country.toLowerCase()
          );
          cust.setSelectedCountry(countryObj || null);
        }
      }

      cust.setPortOfLoading(carData.departure_port || "");
      cust.setPortOfDischarge(carData.port || "");
      cust.setDestinationCountry(carData.destination || "");

      if (carData.currency) {
        const map = { "¥": "JPY", "$": "USD", "€": "EUR" };
        submit.setCurrency(map[carData.currency] || "JPY");
      }

      line.setInitialLineItem({
        refNo: carData.stock_id || "",
        makerCarName: normalizeValue(carData.make),
        model: normalizeValue(carData.car_model),
        chassisNo: carData.chassis_number || "",
        cc: carData.engine_capacity ? `${carData.engine_capacity}cc` : "",
        door: carData.doors || "",
        seat: carData.seats || "",
        shift: "",
        year: carData.year || carData.model_year || "",
        color: normalizeValue(carData.color || ""),
        mileage: carData.mileage || "",
        fuelType: carData.fuel_type || "",
        unitPrice: carData.price || 0,
        freight: 0,
        insurance: 0,
        amount: carData.price || 0,
      });

      if (carData.make) line.addMake(normalizeValue(carData.make));
      if (carData.make && carData.car_model) line.addModel(normalizeValue(carData.make), normalizeValue(carData.car_model));
    };
    fillForm();
  }, [carData]);

  const selectClassNames = useMemo(
    () => ({
      control: ({ isFocused }) =>
        ["w-full", "min-h-[2.5rem]", "border", "rounded-md", "bg-white", "shadow-none",
          isFocused ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-blue-400"].join(" "),
      valueContainer: () => "px-2 py-1",
      placeholder: () => "text-gray-400 text-sm",
      singleValue: () => "text-gray-700 text-sm",
      input: () => "text-sm text-gray-700",
      menu: () => "bg-white border border-gray-200 rounded-md shadow-lg text-sm",
      option: ({ isFocused, isSelected }) =>
        ["px-3", "py-2", "text-sm", "cursor-pointer",
          isSelected ? "bg-blue-500 text-white" : isFocused ? "bg-blue-50 text-blue-600" : "text-gray-700"].join(" "),
      noOptionsMessage: () => "px-3 py-2 text-sm text-gray-500",
      dropdownIndicator: () => "px-2 text-gray-500",
      clearIndicator: () => "px-2 text-gray-500 hover:text-red-500",
      indicatorSeparator: () => "bg-transparent",
      menuPortal: () => "z-[9999]",
    }),
    []
  );

  const menuPortalTarget = typeof window !== "undefined" ? window.document.body : undefined;

  return {
    ...cust,
    ...line,
    ...submit,
    selectClassNames,
    menuPortalTarget,
    handleMakeSelectChange: (index, option) => {
      const value = option ? option.value : "";
      const nv = normalizeValue(value);
      line.handleLineItemChange(index, "makerCarName", nv);
      if (option) {
        if (!line.makes.includes(nv)) line.addMake(nv);
        line.loadModelsForMake(nv);
      } else {
        line.handleLineItemChange(index, "model", "");
      }
    },
    handleMakeCreate: (index, inputValue) => {
      const trimmed = normalizeValue(inputValue);
      if (!trimmed) return;
      line.addMake(trimmed);
      line.handleLineItemChange(index, "makerCarName", trimmed);
      line.loadModelsForMake(trimmed);
    },
    handleModelSelectChange: (index, option) => {
      line.handleLineItemChange(index, "model", option ? option.value : "");
    },
    handleModelCreate: (index, make, inputValue) => {
      const trimmed = normalizeValue(inputValue);
      if (trimmed && make) line.addModel(make, trimmed);
      line.handleLineItemChange(index, "model", trimmed);
    },
  };
}
