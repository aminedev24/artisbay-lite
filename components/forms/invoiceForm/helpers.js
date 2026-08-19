import { BANK_DETAILS } from "./constants";

export const calculateExpiryDate = (invoiceDate) => {
  const date = new Date(invoiceDate);
  let businessDaysAdded = 0;

  while (businessDaysAdded < 5) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      businessDaysAdded += 1;
    }
  }

  return date.toISOString().split("T")[0];
};

export const getInvoiceDate = (regenerate, invoiceData) => {
  return regenerate ? new Date(invoiceData?.created_at) : new Date();
};

export const generateSerialNumber = ({ regenerate, invoiceData }) => {
  const invoiceDateObj = getInvoiceDate(regenerate, invoiceData);
  const year = invoiceDateObj.getFullYear();
  const month = String(invoiceDateObj.getMonth() + 1).padStart(2, "0");
  const day = String(invoiceDateObj.getDate()).padStart(2, "0");
  const hours = String(invoiceDateObj.getHours()).padStart(2, "0");
  const minutes = String(invoiceDateObj.getMinutes()).padStart(2, "0");
  const seconds = String(invoiceDateObj.getSeconds()).padStart(2, "0");

  return `${regenerate ? "RE-" : "DOC-"}${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const getDefaultBankDetails = (currency) =>
  BANK_DETAILS[currency] || BANK_DETAILS.JPY;
