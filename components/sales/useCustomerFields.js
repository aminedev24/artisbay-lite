import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import CountryList from "../utilities/countryList";
import { apiBaseUrl } from "../utilities/apiBase";

const apiUrl = apiBaseUrl;

export default function useCustomerFields() {
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [customerPhoneCode, setCustomerPhoneCode] = useState("");
  const [options, setOptions] = useState([]);

  // BILL TO
  const [billToName, setBillToName] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billToPhone, setBillToPhone] = useState("");
  const billToPreviousRef = useRef({ name: "", address: "", phone: "" });
  const [isBillToSameAsConsignee, setIsBillToSameAsConsignee] = useState(false);

  // SHIP INFO
  const [shipName, setShipName] = useState("");
  const [oceanVessel, setOceanVessel] = useState("");
  const [portOfLoading, setPortOfLoading] = useState("");

  // BOOKING & DISCHARGE
  const [bookingRef, setBookingRef] = useState("");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");

  // CONSIGNEE
  const [consigneeName, setConsigneeName] = useState("");
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneePhone, setConsigneePhone] = useState("");
  const [consigneeEmail, setConsigneeEmail] = useState("");

  // NOTIFY PARTIES
  const [notifyName, setNotifyName] = useState("");
  const [notifyAddress, setNotifyAddress] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");

  // IMPORTER
  const [importerName, setImporterName] = useState("");
  const [importerAddress, setImporterAddress] = useState("");
  const [importerPhone, setImporterPhone] = useState("");
  const [importerEmail, setImporterEmail] = useState("");
  const importerPreviousRef = useRef({ name: "", address: "", phone: "", email: "" });
  const [isImporterSameAsConsignee, setIsImporterSameAsConsignee] = useState(false);

  const fetchUserOptions = async () => {
    const response = await axios.get(`${apiUrl}/users/getUsers.php`);
    if (response.data.status === "success") {
      const formatted = response.data.data.map((u) => ({
        ...u,
        id: Number(u.id),
        value: Number(u.id),
        label: u.full_name || u.customer_name || `${u.id}`,
        type: u.type,
        country: u.country,
      }));
      setOptions(formatted);
      return formatted;
    }
    return [];
  };

  const clearAllCustomerFields = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerPhoneCode("");
    setBillToName("");
    setBillToAddress("");
    setBillToPhone("");
    setConsigneeName("");
    setConsigneeAddress("");
    setConsigneePhone("");
    setNotifyEmail("");
    setConsigneeEmail("");
    setNotifyPhone("");
    setNotifyAddress("");
    setSelectedCountry(null);
    setPortOfDischarge("");
    setPortOfLoading("");
    setIsBillToSameAsConsignee(false);
    setIsImporterSameAsConsignee(false);
    billToPreviousRef.current = { name: "", address: "", phone: "" };
    importerPreviousRef.current = { name: "", address: "", phone: "", email: "" };
  };

  const handleSelectChange = (option) => {
    clearAllCustomerFields();
    if (option.type === "user") {
      setCustomerName(option.full_name || "");
      setCustomerPhone(option.phone || "");
      setCustomerAddress(option.address || "");
      setConsigneeName(option.full_name || "");
      setConsigneeAddress(option.address || "");
      setConsigneeEmail(option.email || "");
      setConsigneePhone(option.phone || "");
      if (option.country) {
        const countryObj = CountryList().find(
          (c) => c.value.toLowerCase() === option.country.toLowerCase() || c.label.toLowerCase() === option.country.toLowerCase()
        );
        setSelectedCountry(countryObj || null);
      }
      setNotifyName(option.full_name || "");
      setNotifyAddress(option.address || "");
      setNotifyPhone(option.phone || "");
      setNotifyEmail(option.email || "");
    } else if (option.type === "customer") {
      setCustomerName(option.customer_name || "");
      setCustomerPhone(option.tel1 || option.mobile || "");
      setCustomerAddress(option.consignee_address || "");
      setConsigneeName(option.customer_name || "");
      setConsigneeAddress(option.consignee_address || option.country || "");
      setConsigneePhone(option.tel1 || "");
      setNotifyName(option.notify || "");
      setNotifyPhone(option.notify_tel || "");
      setNotifyEmail(option.notify_email || option.email1 || "");
      setNotifyAddress(option.notify_address || "");
      if (option.country) {
        const countryObj = CountryList().find(
          (c) => c.value.toLowerCase() === option.country.toLowerCase() || c.label.toLowerCase() === option.country.toLowerCase()
        );
        setSelectedCountry(countryObj || null);
      }
    }
  };

  const handleBillToToggle = (checked) => {
    setIsBillToSameAsConsignee(checked);
    if (checked) {
      billToPreviousRef.current = { name: billToName, address: billToAddress, phone: billToPhone };
      setBillToName(consigneeName || "");
      setBillToAddress(consigneeAddress || "");
      setBillToPhone(consigneePhone || "");
    } else {
      const previous = billToPreviousRef.current;
      setBillToName(previous.name || "");
      setBillToAddress(previous.address || "");
      setBillToPhone(previous.phone || "");
    }
  };

  const handleImporterToggle = (checked) => {
    setIsImporterSameAsConsignee(checked);
    if (checked) {
      importerPreviousRef.current = { name: importerName, address: importerAddress, phone: importerPhone, email: importerEmail };
      setImporterName(consigneeName || "");
      setImporterAddress(consigneeAddress || "");
      setImporterPhone(consigneePhone || "");
      setImporterEmail(consigneeEmail || "");
    } else {
      const previous = importerPreviousRef.current;
      setImporterName(previous.name || "");
      setImporterAddress(previous.address || "");
      setImporterPhone(previous.phone || "");
      setImporterEmail(previous.email || "");
    }
  };

  useEffect(() => {
    if (isBillToSameAsConsignee) {
      setBillToName(consigneeName || "");
      setBillToAddress(consigneeAddress || "");
      setBillToPhone(consigneePhone || "");
    }
  }, [isBillToSameAsConsignee, consigneeName, consigneeAddress, consigneePhone]);

  useEffect(() => {
    if (isImporterSameAsConsignee) {
      setImporterName(consigneeName || "");
      setImporterAddress(consigneeAddress || "");
      setImporterPhone(consigneePhone || "");
      setImporterEmail(consigneeEmail || "");
    }
  }, [isImporterSameAsConsignee, consigneeName, consigneeAddress, consigneePhone, consigneeEmail]);

  useEffect(() => {
    fetchUserOptions();
  }, []);

  const customerPhoneInputValue = useMemo(() => {
    if (!customerPhone) return "";
    if (customerPhoneCode && customerPhone.startsWith(customerPhoneCode)) {
      return customerPhone.slice(customerPhoneCode.length).trimStart();
    }
    return customerPhone;
  }, [customerPhone, customerPhoneCode]);

  const handleCustomerPhoneInputChange = (value) => {
    if (customerPhoneCode) {
      const sanitized = value.replace(/^\+[\d\s-]*/, "").replace(customerPhoneCode, "").trim();
      setCustomerPhone(sanitized ? `${customerPhoneCode} ${sanitized}` : `${customerPhoneCode} `);
    } else {
      setCustomerPhone(value);
    }
  };

  useEffect(() => {
    if (selectedCountry && selectedCountry.countryCode) {
      const code = selectedCountry.countryCode;
      setCustomerPhoneCode(code);
      setCustomerPhone((prev) => {
        if (!prev) return `${code} `;
        if (prev.startsWith(code)) return prev;
        const stripped = prev.replace(/^\+[\d\s-]*/, "").trim();
        return stripped ? `${code} ${stripped}` : `${code} `;
      });
    } else {
      setCustomerPhoneCode("");
      setCustomerPhone((prev) => {
        if (!prev) return prev;
        return prev.replace(/^\+[\d\s-]*/, "").trim();
      });
    }
  }, [selectedCountry]);

  return {
    customerName, setCustomerName,
    customerAddress, setCustomerAddress,
    customerPhone, setCustomerPhone,
    selectedCountry, setSelectedCountry,
    customerPhoneCode, setCustomerPhoneCode,
    customerPhoneInputValue, handleCustomerPhoneInputChange,
    options, handleSelectChange,
    billToName, setBillToName, billToAddress, setBillToAddress, billToPhone, setBillToPhone,
    isBillToSameAsConsignee, handleBillToToggle,
    shipName, setShipName, oceanVessel, setOceanVessel, portOfLoading, setPortOfLoading,
    bookingRef, setBookingRef, portOfDischarge, setPortOfDischarge, destinationCountry, setDestinationCountry,
    consigneeName, setConsigneeName, consigneeAddress, setConsigneeAddress,
    consigneePhone, setConsigneePhone, consigneeEmail, setConsigneeEmail,
    notifyName, setNotifyName, notifyAddress, setNotifyAddress,
    notifyPhone, setNotifyPhone, notifyEmail, setNotifyEmail,
    importerName, setImporterName, importerAddress, setImporterAddress,
    importerPhone, setImporterPhone, importerEmail, setImporterEmail,
    isImporterSameAsConsignee, handleImporterToggle,
    fetchUserOptions,
  };
}
