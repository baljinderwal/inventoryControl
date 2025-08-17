import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (invoice, customer) => {
  const doc = new jsPDF();

  // Document Title
  doc.setFontSize(20);
  doc.text('Invoice', 14, 22);

  // Invoice Details
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.id}`, 14, 32);
  doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 14, 38);
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 44);

  // Customer Details
  doc.setFontSize(12);
  doc.text('Bill To:', 140, 32);
  doc.setFontSize(10);
  doc.text(customer.name || '', 140, 38);
  doc.text(customer.email || '', 140, 43);
  doc.text(customer.address || '', 140, 48);

  // Line items table
  const tableColumn = ["Product Name", "Quantity", "Unit Price", "Total"];
  const tableRows = [];

  invoice.items.forEach(item => {
    const total = item.quantity * item.price;
    const row = [
      item.productName,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${total.toFixed(2)}`
    ];
    tableRows.push(row);
  });

  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
  });

  // Grand Total
  const finalY = doc.previousAutoTable.finalY;
  doc.setFontSize(12);
  doc.text(`Total: $${invoice.total.toFixed(2)}`, 140, finalY + 10);

  // Footer
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 14, doc.internal.pageSize.height - 10);

  // Save the PDF
  doc.save(`Invoice_${invoice.id}.pdf`);
};
