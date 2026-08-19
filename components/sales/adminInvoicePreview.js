import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import AdminInvoicePdf from "./adminInvoicePdf"; // Your PDF component

const InvoicePreview = ({ invoiceData }) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <AdminInvoicePdf invoiceData={invoiceData} />
    </PDFViewer>
  );
};

export default InvoicePreview;