import React from "react";

const PrintComponent = ({
  contentSelector,
  title = "Print Report",
  footer = "© Garage Pulse - Vehicle Management System",
  showDateTime = true,
}) => {
  const handlePrint = () => {
    const content = document.querySelector(contentSelector);
    if (!content) {
      alert("Print content not found!");
      return;
    }

    const clone = content.cloneNode(true);
    clone.classList.add("print-section");

    const contentWidth = content.offsetWidth;
    const layoutClass = contentWidth > 600 ? "two-column" : "one-column";

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    const printStyles = `
      <style>
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
        }

        body {
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
        }

        .print-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }

        .print-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 20px;
        }

        .one-column {
          display: block;
        }

        .section {
          margin-bottom: 10px;
        }

        .section h5 {
          font-size: 16px;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
          margin-bottom: 6px;
        }

        .section p {
          margin: 2px 0;
          font-size: 14px;
        }

        .vehicle-title {
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        /* Fit to one page neatly */
        @page {
          size: A4;
          margin: 15mm;
        }
      </style>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          ${printStyles}
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="container mt-4">
            <div class="print-header">
              <h2>${title}</h2>
              ${
                showDateTime
                  ? `<p>Generated on: ${dateStr} ${timeStr}</p>`
                  : ""
              }
            </div>
            <div class="${layoutClass}">${clone.outerHTML}</div>
            <div class="print-footer">
              <p>${footer}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <button className="btn btn-success print-btn" onClick={handlePrint}>
      Print
    </button>
  );
};

export default PrintComponent;
