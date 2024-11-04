import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
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

export const exportToPdf = (
  rows: any,
  reportName: string,
  orientation: "landscape" | "portrait"
) => {
  try {
    const doc = new jsPDF({
      orientation: orientation,
    });
    const tableData = rows.map(({ id, ...rest }: any) => Object.values(rest));
    const tableHeaders = Object.keys(rows[0]).filter((x) => x !== "id");
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });
    doc.save(`${reportName}.pdf`);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

export const getDefaultDate = (defaultDate: string) => {
  switch (defaultDate) {
    case "SYSDATE":
      return dayjs().format("YYYY-MM-DD");
    case "YESTERDAY":
      return dayjs().subtract(1, "day").format("YYYY-MM-DD");
    case "FIRSTDAYPREVIOUSMONTH":
      return dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
    case "LASTDAYPREVIOUSMONTH":
      return dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
    default:
      return "";
  }
};

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0; 
      const v = c === 'x' ? r : (r & 0x3 | 0x8); 
      return v.toString(16);
  });
}