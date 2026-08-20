import React, { useEffect } from 'react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

const Modal = ({ isOpen, onClose, orders, setIsModalOpen }) => {
  useEffect(() => {
    const handleAfterPrint = () => {
      const printTable = document.querySelector('.print-table');
      if (printTable) {
        printTable.style.backgroundImage = `url(/images/printwatermark-meridian.svg)`;
      }
      setIsModalOpen(false);
    };

    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [onClose, setIsModalOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('printable-content');
    const logoSrc = `/images/logo-meridian-dark.svg`;
    const watermarkSrc = `/images/printwatermark-meridian.svg`;
    const printWindow = window.open('', '_blank');

    // Sanitize DOM content before injecting into print window
    const safeContent = DOMPurify.sanitize(printContent.innerHTML);

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Orders</title>
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            body {
              font-family: Arial, sans-serif;
              margin: 0;
              position: relative;
            }

            body::after {
              content: "";
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('${watermarkSrc}');
              background-repeat: no-repeat;
              background-position: center;
              background-size: 60% auto;
              opacity: 0.2;
              z-index: -1;
            }

            .header {
              text-align: center;
              margin-bottom: 20px;
              position: relative;
              z-index: 1;
            }

            .header img {
              width: 100px;
              height: auto;
            }

            .content-wrapper {
              position: relative;
              z-index: 1;
              padding: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              background-color: rgba(255, 255, 255, 0.8);
            }

            th, td {
              text-align: center;
              border: 1px solid #ddd;
              padding: 8px;
              font-weight: bold;
              color: #333;
            }

            th {
              background-color: rgba(42, 157, 143, 0.7);
            }

            .total {
              font-weight: bold;
              text-align: right;
              margin-top: 10px;
              font-size: 1.2em;
              background-color: rgba(255, 255, 255, 0.8);
              padding: 5px 10px;
              display: inline-block;
            }

            @page {
              size: auto;
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoSrc}" alt="Company Logo" />
          </div>
          <h2>Your Orders</h2>
          <div class="content-wrapper">
            ${safeContent}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 100);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const allOrders = Object.values(orders).flat();
  const totalQuantity = allOrders.reduce((total, order) => total + order.quantity, 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content orders">
        <button className="close-btn" onClick={onClose}>&minus;</button>
        <div id="printable-content">
          <table
            className="orders-table print-table"
            style={{
              backgroundImage: `url(/images/printwatermark-meridian.svg)`,
              WebkitPrintColorAdjust: 'exact',
            }}
          >
            <thead>
              <tr>
                <th>Make</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.make}</td>
                  <td>{`${order.width}/${order.aspect_ratio}R${order.rim_diameter}`}</td>
                  <td>{order.quantity}</td>
                  <td>{order.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total">Total Quantity: {totalQuantity}</div>
        </div>
        <div className='action-btns'>
          <button className="print-button" onClick={handlePrint}>Print Orders</button>
          <Link href='/invoice-generator' className='print-button'>Generate Invoice</Link>
        </div>

      </div>
    </div>
  );
};

export default Modal;
