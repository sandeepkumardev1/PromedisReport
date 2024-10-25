import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReportsAction } from "../redux/actions/reportActions";
import ResponsiveAppBar from "../components/AppBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

function Reports() {
  const dispatch = useDispatch();
  const accesscode = useSelector((state: any) => state.auth?.accessCode);

  useEffect(() => {
    dispatch(getMasterReportsAction(accesscode));
  }, [dispatch, accesscode]);

  const rows: any = [
    { "id": 1,
      "Reg No": "IRT24Y000866",
      "Reg Date": "06-Oct-2024 07:39AM",
      "Çustomer Name": "LEENA",
      "Paid Date": "06-Oct-2024 07:49AM",
      "Payment Type": "CASH RETURN",
      Details: "PATIENT ASKED",
      "Bill Amount": 250,
      Amount: -20,
    },
    {"id": 2,
      "Reg No": "IRT24Y001066",
      "Reg Date": "14-Oct-2024 07:29AM",
      "Çustomer Name": "PAVITHRAN",
      "Paid Date": "14-Oct-2024 07:32AM",
      "Payment Type": "CASH RETURN",
      Details: "patient asked",
      "Bill Amount": 490,
      Amount: -60,
    },
    {"id": 3,
      "Reg No": "IRT24Y001110",
      "Reg Date": "15-Oct-2024 10:18AM",
      "Çustomer Name": "MINHA FATHIMA",
      "Paid Date": "15-Oct-2024 12:39PM",
      "Payment Type": "CASH RETURN",
      Details: "URINE NOT RECIVED",
      "Bill Amount": 50,
      Amount: -50,
    },
    {"id": 4,
      "Reg No": "IRT24Y001204",
      "Reg Date": "18-Oct-2024 01:17PM",
      "Çustomer Name": "SURENDRAN",
      "Paid Date": "18-Oct-2024 01:22PM",
      "Payment Type": "CASH RETURN",
      Details: "FULL TEST CHANGED",
      "Bill Amount": 40,
      Amount: -40,
    },
  ];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: "Reg No", headerName: "Reg No", width: 70 },
    { field: "Reg Date", headerName: "First name", width: 130 },
    { field: "Çustomer Name", headerName: "Last name", width: 130 },
    {
      field: "Paid Date",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "Payment Type",
      headerName: "Full name",
      width: 160,
    },
    { field: "Details", headerName: "Last name", width: 130 },
    { field: "Bill Amount", headerName: "Last name", width: 130 },
    { field: "Amount", headerName: "Last name", width: 130 },

  ];
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <>
      <ResponsiveAppBar />
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
        />
      </Paper>
    </>
  );
}

export default Reports;
