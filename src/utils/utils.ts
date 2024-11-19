import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export const exportToExcel = (rows: any, reportName: string, filter: any) => {
  const workbook = XLSX.utils.book_new();
  const columns: string[] = Object.keys(rows[0]).filter((x) => x !== "id");
  const titleRow = [reportName];
  let filterText = "";
  Object.keys(filter).map((item) => {
    filterText =
      filterText +
      `${item}: ${
        filter[item] == "0" || filter[item] == "1" ? "ALL" : filter[item]
      }` +
      "   ";
  });
  const appliedFilter = [filterText];
  const emptyRow: any = [];
  const dataRows = rows.map(({ id, ...rest }: any) => Object.values(rest));
  const finalData = [titleRow, appliedFilter, emptyRow, columns, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(finalData);
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
  ];

  worksheet["!cols"] = columns.map((col: string) => ({
    wch: Math.max(
      rows[0][col] ? String(rows[0][col]).length * 1.2 : col.length * 2,
      col.length * 2
    ),
  }));

  XLSX.utils.book_append_sheet(workbook, worksheet, reportName);
  XLSX.writeFile(workbook, `${reportName}.xlsx`, { compression: true });
};

export const exportToPdf = (
  rows: any,
  reportName: string,
  orientation: "landscape" | "portrait",
  filter: any
) => {
  try {
    const doc = new jsPDF({
      orientation: orientation,
    });
    const tableData = rows.map(({ id, ...rest }: any) => Object.values(rest));
    const tableHeaders = Object.keys(rows[0]).filter((x) => x !== "id");
    let filterText = "";
    Object.keys(filter).map((item) => {
      filterText =
        filterText +
        `${item}: ${
          filter[item] == "0" || filter[item] == "1" ? "ALL" : filter[item]
        }` +
        "   ";
    });
    doc.setTextColor(0, 100, 230);
    doc.setFontSize(12);
    doc.text(reportName, 14, 20, { align: "left" });
    doc.text(filterText, 14, 27, { align: "left" });
    var alignments: any = new Object();

    Object.keys(tableData[0]).map((item, index) => {
      if (!isNaN(tableData[0][item])) {
        alignments[index] = { halign: "right" };
      }
    });

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      theme: "grid",
      headStyles: {
        fillColor: [203,213,225],
        textColor: [0, 0, 0],
      },
      columnStyles: {
        ...alignments,
      },
      didDrawPage: function () {
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.text(
          "Printed on: " + formatDateTime(new Date()),
          orientation === "landscape" ? 283 : 196,
          pageHeight - 10,
          { align: "right" }
        );
      },
    });

    for (let i = 0; i < doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text(
        `Page ${
          i == 0 ? doc.getNumberOfPages() : i
        } of ${doc.getNumberOfPages()}`,
        14,
        pageHeight - 10,
        { align: "left" }
      );
    }
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
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function formatDateTime(date: any) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return formatter.format(date).replace("pm", "PM").replace("am", "AM");
}
