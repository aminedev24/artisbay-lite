// components/InvoicePreviewLayout.js
import React, {useState, useEffect} from 'react';
import InvoicePreview from './adminInvoicePreview';
import { PDFViewer } from "@react-pdf/renderer";
import AdminInvoicePdf from "./adminInvoicePdf"; // Your PDF component
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Disable text selection
import 'react-pdf/dist/esm/Page/TextLayer.css'; // Disable text layer
import { BlobProvider } from '@react-pdf/renderer';
import { pdfjs } from 'react-pdf';
import useCheckScreenSize from '../utilities/screenSize';
import { apiBaseUrl } from '../utilities/apiBase';

// Set the worker path
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/aja
x/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function InvoicePreviewLayout({ invoice }) {
  const {
    customer,
    billTo,
    shipInfo,
    bookingDischarge,
    consignee,
    notifyParties,
    importer,
    tax,
    notes,
    lineItems,
    containerNumber,
    blNumber,
  } = invoice;

  
  const { isSmallScreen } = useCheckScreenSize();
  const [invoiceCounter, setInvoiceCounter] = useState(""); // Initialize invoice counter
  const [error, setError] = useState(null); // For handling errors
  const [isLoading, setIsLoading] = useState(false); // For handling loading state
  const apiUrl = apiBaseUrl;

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  //const taxAmount = subtotal * (parseFloat(tax || 0) / 100);
  const total = subtotal// + taxAmount;

  useEffect(() => {
    // Function to get the next invoice number from the backend
    const fetchInvoiceNumber = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/finance/invoices/getInvoiceNumber.php`);
        const data = await response.json();
  
        if (data.invoiceNumber) {
          setInvoiceCounter(data.invoiceNumber); // Set the invoice number to state
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

  if (!invoice) {
    return <p>Loading invoice data...</p>; // Handle undefined invoiceData
  }

  return (
    <div className="invoice-preview-container">
      {/* Header */}
      <div className="invoice-header">
        <h1>Commercial Invoice</h1>
      </div>

      {/*
      <div className="address-columns-container">
     
        <div className="address-column">
          
          <div className="address-block">
            <h3 className="address-block-title">CUSTOMER</h3>
            <div className="address-row">
              <span className="address-label">Name:</span>
              <span className="address-value">{customer?.name}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Address:</span>
              <span className="address-value">{customer?.address}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Phone:</span>
              <span className="address-value">{customer?.phone}</span>
            </div>
             <div className="address-row">
              <span className="address-label">Country:</span>
              <span className="address-value">{customer?.country}</span>
            </div>
          </div>

         
          <div className="address-block">
            <h3 className="address-block-title">BILL TO</h3>
            <div className="address-row">
              <span className="address-label">Name:</span>
              <span className="address-value">{billTo?.name}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Address:</span>
              <span className="address-value">{billTo?.address}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Phone:</span>
              <span className="address-value">{billTo?.phone}</span>
            </div>
          </div>

       
          <div className="shipping-pair-block">
            <div className="shipping-pair-item-left">
              <h4 className="address-block-title">SHIP NAME</h4>
              <span>{shipInfo?.shipName}</span>
            </div>
            <div className="shipping-pair-item-left">
              <h4 className="address-block-title">PORT OF LOADING</h4>
              <span>{shipInfo?.portOfLoading}</span>
            </div>
             <div className="shipping-pair-item">
              <h4 className="address-block-title">Destination country </h4>
              <span>{shipInfo?.destinationCountry}</span>
            </div>
          </div>

          <div className="shipping-pair-block">
            <div className="shipping-pair-item-left">
              <h4 className="address-block-title">BOOKING REF</h4>
              <span>{bookingDischarge?.bookingRef}</span>
            </div>
            <div className="shipping-pair-item">
              <h4 className="address-block-title">PORT OF DISCHARGE</h4>
              <span>{bookingDischarge?.portOfDischarge}</span>
            </div>
          </div>
        </div>

    
        <div className="address-column">
          
          <div className="address-block">
            <h3 className="address-block-title">CONSIGNEE</h3>
            <div className="address-row">
              <span className="address-label">Name:</span>
              <span className="address-value">{consignee?.name}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Address:</span>
              <span className="address-value">{consignee?.address}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Phone:</span>
              <span className="address-value">{consignee?.phone}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Email:</span>
              <span className="address-value">{consignee?.email}</span>
            </div>
          </div>

       
          <div className="address-block">
            <h3 className="address-block-title">NOTIFY PARTIES</h3>
            <div className="address-row">
              <span className="address-label">Name:</span>
              <span className="address-value">{notifyParties?.name}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Address:</span>
              <span className="address-value">{notifyParties?.address}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Phone:</span>
              <span className="address-value">{notifyParties?.phone}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Email:</span>
              <span className="address-value">{notifyParties?.email}</span>
            </div>
          </div>

        
          <div className="address-block">
            <h3 className="address-block-title">IMPORTER - IF OTHER THAN CONSIGNEE</h3>
            <div className="address-row">
              <span className="address-label">Name:</span>
              <span className="address-value">{importer?.name}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Address:</span>
              <span className="address-value">{importer?.address}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Phone:</span>
              <span className="address-value">{importer?.phone}</span>
            </div>
            <div className="address-row">
              <span className="address-label">Email:</span>
              <span className="address-value">{importer?.email}</span>
            </div>
          </div>
          <div className='address-block'> 
            <h3 className="address-block-title">Container</h3>
            <div className='address-row'>
              <span className="address-label" style={{width: '75px'}}>Container No:</span>
              <span className="address-value">{containerNumber}</span>
            </div>

             <div className='address-row'>
              <span className="address-label">BL number:</span>
              <span className="address-value">{blNumber}</span>
            </div>

          </div>
        </div>
      </div>

      <div className="invoice-important-notice">
        <h3>IMPORTANT NOTICE</h3>
        <div style={{flex: '1'}}>
          <p className='first-p'><span>Your invoice number</span> <span>AB-{invoiceCounter}</span> <span>must be on the TT-slip!</span></p>
          <br />
          <p className='second-p'>Without your invoice number, shipping will be delayed!!</p>
        </div>
      </div>

  
      <div className="notes-amount-container">
       
        <div className="invoice-notes">
          <h4>Notes</h4>
          <p>1-Please indicate the purpose of money transfer as "CAR" or "CAR PAYMENT".</p>
          <p>2-This invoice is valid for 3 business days only from the date herein.</p>
          <p>The sale is conducted first come, first served basis and secured
          upon payment proof.</p>
          <p>3-Customer needs to pay remaining balance payment within 15 days</p>
          <p>from shipment date. After 15 days, you will need to
            surrender a copy of PIN & ID of the consignee 
            of the car</p>
        </div>

     
        <div className="amount-box">
          <div className="amount-label">Amount:</div>
          <div className="amount-value">{invoice.currency}{total.toLocaleString()}</div>
          <div className="bank-charge-text">*Bank charge must be beared by remitter</div>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Ref No.</th>
            <th>Maker / Car name<br />Chassis No</th>
            <th>Description of Goods</th>
            <th>Unit Price</th>
            <th>Freight</th>
            <th>Insurance</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.refNo}</td>
              <td>
                {item.makerCarName}
                {item.chassisNo && <><br />{item.chassisNo}</>}
              </td>
              <td>
                {item.goodsDescription}
                {item.cc && <><br />CC: {item.cc}</>}
                {item.door && <><br />Door: {item.door}</>}
                {item.seat && <><br />Seat: {item.seat}</>}
                {item.shift && <><br />Shift: {item.shift}</>}
              </td>
              <td>{parseFloat(item.unitPrice).toLocaleString()}</td>
              <td>
                {parseFloat(item.freight).toLocaleString()}
                {item.freight === 0 && <><br />(Included in unit price)</>}
              </td>
              <td>
                {parseFloat(item.insurance).toLocaleString()}
                {item.insurance === 0 && <><br />(Included in unit price)</>}
              </td>
              <td>{parseFloat(item.amount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer-totals">
        <div className="footer-left">
          <span className="total-label">TOTAL</span>
          <span className="total-value">{lineItems.length}</span>
          <span className="total-label">UNIT(S)</span>
        </div>
        <div className="footer-right">
          <span className="total-label">TOTAL PRICE</span>
          <span className="footer-item">C&F</span>
          <span className="footer-item">{invoice.currency}</span>
          <span className="total-value">{invoice.currency}{total.toLocaleString()}</span>
        </div>
      </div>
      */}


    <BlobProvider document={<AdminInvoicePdf invoiceData={invoice} />}>
      {({ blob, url, loading, error }) => {
        if (loading) return <div>Loading PDF...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return (
          <iframe
            src={url}
            style={{ width: '100%', height: isSmallScreen ? '50vh': '100vh', border: 'none' }}
            title="PDF Preview"
          />
        );
      }}
    </BlobProvider>
    </div>
  );
}