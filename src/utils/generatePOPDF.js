import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePOPDF = (purchaseOrder, productsData, suppliersData) => {
  const doc = new jsPDF();

  const supplier = suppliersData.find(s => s.id === purchaseOrder.supplierId) || {};

  // Document Title
  doc.setFontSize(20);
  doc.text('Purchase Order', 14, 22);

  // PO Details
  doc.setFontSize(12);
  doc.text(`PO #: ${purchaseOrder.id}`, 14, 32);
  doc.text(`Date: ${new Date(purchaseOrder.createdAt).toLocaleDateString()}`, 14, 38);

  // Supplier Details
  doc.setFontSize(12);
  doc.text('Supplier:', 140, 32);
  doc.setFontSize(10);
  doc.text(supplier.name || '', 140, 38);
  doc.text(supplier.contact || '', 140, 43);
  doc.text(supplier.email || '', 140, 48);

  // Line items table
  const tableColumn = ["Product ID", "Product Name", "Quantity", "Unit Price", "Total"];
  const tableRows = [];
  let grandTotal = 0;

  purchaseOrder.products.forEach(item => {
    const product = productsData.find(p => p.id === item.productId);
    if (product) {
      const total = item.quantity * product.price;
      const row = [
        product.id,
        product.name,
        item.quantity,
        `$${product.price.toFixed(2)}`,
        `$${total.toFixed(2)}`
      ];
      tableRows.push(row);
      grandTotal += total;
    }
  });

  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
  });

  // Grand Total
  const finalY = doc.previousAutoTable.finalY;
  doc.setFontSize(12);
  doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 140, finalY + 10);

  // Footer
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 14, doc.internal.pageSize.height - 10);

  // Save the PDF
  doc.save(`Purchase_Order_${purchaseOrder.id}.pdf`);
};
