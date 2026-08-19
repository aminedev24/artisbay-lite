import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import AdminInvoicePdf from "./adminInvoicePdf";
import { calculateExpiryDate } from "../forms/invoiceForm/helpers";
import { BANK_DETAILS } from "../forms/invoiceForm/constants";
import CountryList from "../utilities/countryList";
import { apiBaseUrl } from "../utilities/apiBase";
import { useFormatLineItems } from "./invoiceUtils";

const apiUrl = apiBaseUrl;

export default function useInvoiceSubmission(customerFields, lineItemFields) {
  const formatLineItemsForOutput = useFormatLineItems();

  const [invoiceCounter, setInvoiceCounter] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const defaultInvoiceDate = new Date().toISOString().split("T")[0];
  const [invoiceDate, setInvoiceDate] = useState(defaultInvoiceDate);
  const [expiryDate, setExpiryDate] = useState(calculateExpiryDate(defaultInvoiceDate));
  const [blNumber, setblNumber] = useState("");
  const [containerNumber, setContainerNumber] = useState("");
  const [tax, setTax] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("JPY");

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/finance/invoices/getInvoiceNumber.php`);
        const data = await response.json();
        if (data.invoiceNumber) {
          setError(null);
          setInvoiceCounter(`AB_${data.invoiceNumber}`);
        } else {
          setError("Failed to fetch invoice number");
        }
      } catch (err) {
        console.error("Error fetching invoice number:", err);
        setError("An error occurred while fetching the invoice number");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoiceNumber();
  }, []);

  const handleInvoiceDateChange = (dateValue) => {
    setInvoiceDate(dateValue);
    setExpiryDate(calculateExpiryDate(dateValue));
  };

  const showAlert = (message, type = "alert") => {
    setTimeout(() => {
      setModalMessage(message);
      setModalType(type);
      setShowModal(true);
    }, 1000);
  };

  const buildFormData = (lineItems) => {
    const bankInfo = BANK_DETAILS[currency] || BANK_DETAILS.USD;
    const formattedLineItems = formatLineItemsForOutput(lineItems);
    return {
      customer: {
        name: customerFields.customerName,
        address: customerFields.customerAddress,
        phone: customerFields.customerPhone,
        country: customerFields.selectedCountry?.label,
      },
      billTo: { name: customerFields.billToName, address: customerFields.billToAddress, phone: customerFields.billToPhone },
      shipInfo: { shipName: customerFields.shipName, oceanVessel: customerFields.oceanVessel, portOfLoading: customerFields.portOfLoading, destinationCountry: customerFields.destinationCountry },
      bookingDischarge: { bookingRef: customerFields.bookingRef, portOfDischarge: customerFields.portOfDischarge },
      consignee: { name: customerFields.consigneeName, address: customerFields.consigneeAddress, phone: customerFields.consigneePhone, email: customerFields.consigneeEmail },
      notifyParties: { name: customerFields.notifyName, address: customerFields.notifyAddress, phone: customerFields.notifyPhone, email: customerFields.notifyEmail },
      importer: { name: customerFields.importerName, address: customerFields.importerAddress, phone: customerFields.importerPhone, email: customerFields.importerEmail },
      tax, notes, lineItems: formattedLineItems, currency, invoiceCounter, expiryDate, invoiceDate, blNumber, containerNumber, ...bankInfo,
    };
  };

  const buildPreviewData = () => {
    const determineCustomerCountry = () => {
      if (customerFields.selectedCountry?.label) return customerFields.selectedCountry.label;
      if (customerFields.customerAddress) {
        const addressParts = customerFields.customerAddress.split(",").map((part) => part.trim());
        const countryList = CountryList();
        for (let i = addressParts.length - 1; i >= 0; i--) {
          const part = addressParts[i];
          const found = countryList.find((c) => c.label === part || c.value === part);
          if (found) return found.label;
        }
      }
      return "";
    };
    const bankInfo = BANK_DETAILS[currency] || BANK_DETAILS.USD;
    return {
      customer: { name: customerFields.customerName, address: customerFields.customerAddress, phone: customerFields.customerPhone, country: determineCustomerCountry() },
      billTo: { name: customerFields.billToName, address: customerFields.billToAddress, phone: customerFields.billToPhone },
      shipInfo: { shipName: customerFields.shipName, oceanVessel: customerFields.oceanVessel, portOfLoading: customerFields.portOfLoading, destinationCountry: customerFields.destinationCountry || "" },
      bookingDischarge: { bookingRef: customerFields.bookingRef, portOfDischarge: customerFields.portOfDischarge },
      consignee: { name: customerFields.consigneeName, address: customerFields.consigneeAddress, phone: customerFields.consigneePhone, email: customerFields.consigneeEmail },
      notifyParties: { name: customerFields.notifyName, address: customerFields.notifyAddress, phone: customerFields.notifyPhone, email: customerFields.notifyEmail },
      importer: { name: customerFields.importerName, address: customerFields.importerAddress, phone: customerFields.importerPhone, email: customerFields.importerEmail },
      blNumber, containerNumber, tax, notes,
      lineItems: formatLineItemsForOutput(lineItemFields.lineItems),
      currency, invoiceCounter, expiryDate, invoiceDate, ...bankInfo,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasMissing = lineItemFields.lineItems.some((item) => !item.makerCarName || !item.makerCarName.trim() || !item.model || !item.model.trim());
    if (hasMissing) {
      showAlert("Please provide both make and model for every line item before generating the invoice.");
      return;
    }
    const formData = buildFormData(lineItemFields.lineItems);
    const blob = await pdf(<AdminInvoicePdf invoiceData={formData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceCounter}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAlert("Invoice generated successfully!");
  };

  const handlePreview = () => {
    const data = buildPreviewData();
    setPreviewData(data);
    setShowPreview(true);
  };

  const generateDummyInvoiceData = () => {
    setInvoiceCounter("AB_0001");
    handleInvoiceDateChange("2023-10-01");
    const usa = CountryList().find((c) => c.value === "USA");
    customerFields.setSelectedCountry(usa || null);
    customerFields.setCustomerName("Global Imports LLC");
    customerFields.setCustomerAddress("456 Market St, San Francisco, CA 94103");
    customerFields.setCustomerPhone("+1 (555) 765-4321");
    customerFields.setBillToName("Global Imports LLC");
    customerFields.setBillToAddress("456 Market St, San Francisco, CA 94103");
    customerFields.setBillToPhone("+1 (555) 765-4321");
    customerFields.setShipName("Ocean Carrier");
    customerFields.setOceanVessel("MV Pacific Star");
    customerFields.setPortOfLoading("Port of New York");
    customerFields.setBookingRef("BK-2023-1001");
    customerFields.setPortOfDischarge("Port of Hamburg");
    customerFields.setConsigneeName("European Distributors GmbH");
    customerFields.setConsigneeAddress("123 Trade Center, Hamburg, Germany");
    customerFields.setConsigneePhone("+49 40 1234567");
    customerFields.setConsigneeEmail("contact@eurodist.com");
    customerFields.setNotifyName("Shipping Notifications Inc.");
    customerFields.setNotifyAddress("789 Logistics Park, Hamburg, Germany");
    customerFields.setNotifyPhone("+49 40 7654321");
    customerFields.setNotifyEmail("notify@shipping-alerts.com");
    customerFields.setImporterName("German Auto Importers");
    customerFields.setImporterAddress("456 Autostrasse, Berlin, Germany");
    customerFields.setImporterPhone("+49 30 9876543");
    customerFields.setImporterEmail("imports@germanauto.de");
    lineItemFields.setLineItems([
      { refNo: "CAR-001", makerCarName: "TOYOTA", model: "CAMRY HYBRID", chassisNo: "JT2BF22K1W0123456", cc: "2500", door: "4", seat: "5", shift: "Automatic", year: "2020", color: "WHITE", mileage: "45,000 km", fuelType: "Hybrid", unitPrice: 25000, freight: 1500, insurance: 500, amount: 27000 },
      { refNo: "CAR-002", makerCarName: "HONDA", model: "ACCORD EX-L", chassisNo: "1HGCM82633A123456", cc: "2000", door: "4", seat: "5", shift: "Automatic", year: "2021", color: "GRAY", mileage: "32,000 km", fuelType: "Petrol", unitPrice: 28000, freight: 1500, insurance: 500, amount: 30000 },
    ]);
    lineItemFields.addMake("Toyota");
    lineItemFields.addMake("Honda");
    lineItemFields.addModel("Toyota", "Camry Hybrid");
    lineItemFields.addModel("Honda", "Accord EX-L");
    setTax("7.5");
    setNotes("Thank you for your business. Payment due within 30 days of invoice date.");
  };

  return {
    invoiceCounter, setInvoiceCounter,
    error, isLoading, showModal, setShowModal, modalMessage, modalType,
    showPreview, setShowPreview, previewData,
    invoiceDate, handleInvoiceDateChange, expiryDate, setExpiryDate,
    blNumber, setblNumber, containerNumber, setContainerNumber,
    tax, setTax, notes, setNotes, currency, setCurrency,
    handleSubmit, handlePreview, generateDummyInvoiceData, showAlert,
  };
}
