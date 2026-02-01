// Utility to export array of objects to Excel file
import * as XLSX from 'xlsx';

export function exportToExcel(data, filename = 'orders.xlsx') {
  // Prepare worksheet from data
  const ws = XLSX.utils.json_to_sheet(data);
  // Create workbook and append worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  // Write file
  XLSX.writeFile(wb, filename);
}
