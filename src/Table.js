import React, { useState, useMemo } from "react";
import DataGrid from "react-data-grid";
import { exportToCsv, exportToXlsx, exportToPdf } from './exportUtils';
import "react-data-grid/lib/styles.css";
import { mockDataContacts } from "./components/Data";
function Table() {
  const columns = [
    { key: "id", name: "ID" },
    { key: "name", name: "Name" },
    { key: "email", name: "Email" },
    { key: "age", name: "Age" },
    { key: "phone", name: "Phone", width: "max-content" },
    { key: "address", name: "Address", width: "max-content" },
    { key: "city", name: "City" },
    { key: "zipCode", name: "ZipCode" },
    { key: "registrarId", name: "RegistrarId" },
  ];

  const [rows, setRows] = useState(mockDataContacts);
  // const [sort, setSort] = useState([]);
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [sortColumns, setSortColumns] = useState([]);

  function getComparator(sortColumn) {
    // cases are the colum key
    switch (sortColumn) {
      // sort colum with strings
      case "name":
      case "email":
      case "address":
      case "city":
      case "phone":
        return (a, b) => {
          return a[sortColumn].localeCompare(b[sortColumn]);
        };
      // sort colums with numbers
      case "id":
      case "age":
      case "zipCode":
      case "registrarId":
        return (a, b) => {
          return a[sortColumn] - b[sortColumn];
        };
      default:
        // throw new Error(`unsupported sortColumn: "${sortColumn}"`);
        console.log(`unsupported sortColumn: "${sortColumn}"`);
    }
  }

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const compResult = getComparator(sort.columnKey)(a, b);
        // const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === "ASC" ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [rows, sortColumns]);

  function rowKeyGetter(row) {
    return row.id;
  }

  // Function for summery rows
  const summaryRows = useMemo(() => {
    const summaryRow = {
      id: "total_0",
      totalCount: rows.length,
      yesCount: rows.filter((r) => r.available).length,
    };
    return [summaryRow];
  }, [rows]);

  // Export files

  const toolbarClassname = `
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-block-end: 8px;
`;

  const gridElement = (
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={sortedRows}
      defaultColumnOptions={{
        sortable: true,
        resizable: true,
      }}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onRowsChange={setRows}
      sortColumns={sortColumns}
      onSortColumnsChange={setSortColumns}
      // topSummaryRows={summaryRows}
      // bottomSummaryRows={summaryRows}

      className="w-auto mx-auto gap-0.5 bg-green-500"
      direction="ltr"
    />
  );

  return (
    <div className="bg-red-500 w-full h-screen flex  items-center ">
      <div className={toolbarClassname}>
        <ExportButton
          onExport={() => exportToCsv(gridElement, "CommonFeatures.csv")}
        >
          Export to CSV
        </ExportButton>
        <ExportButton
          onExport={() => exportToXlsx(gridElement, "CommonFeatures.xlsx")}
        >
          Export to XSLX
        </ExportButton>
        <ExportButton
          onExport={() => exportToPdf(gridElement, "CommonFeatures.pdf")}
        >
          Export to PDF
        </ExportButton>
      </div>
      {gridElement}
    </div>
  );
}

function ExportButton({ onExport, children }) {
  const [exporting, setExporting] = useState(false);
  return (
    <button
      disabled={exporting}
      onClick={async () => {
        setExporting(true);
        await onExport();
        setExporting(false);
      }}
    >
      {exporting ? "Exporting" : children}
    </button>
  );
}

export default Table;
