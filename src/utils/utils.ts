import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportToExcel = (rows: any, reportName: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(
    rows.map(({ id, ...rest }: any) => rest)
  );
  const columns: string[] = Object.keys(rows[0]).filter((x) => x !== "id");
  XLSX.utils.book_append_sheet(workbook, worksheet, reportName);
  XLSX.utils.sheet_add_aoa(worksheet, [columns]);
  XLSX.writeFile(workbook, `${reportName}.xlsx`, { compression: true });
};

export const exportToPdf = (rows: any, reportName: string,orientation:"landscape"|"portrait") => {
  try {
    const doc = new jsPDF({
      orientation: orientation,
      
    });
    const tableData = rows.map(({ id, ...rest }: any) => Object.values(rest));
    const tableHeaders = Object.keys(rows[0]).filter((x) => x !== "id");;
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });
    doc.save(`${reportName}.pdf`);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};
