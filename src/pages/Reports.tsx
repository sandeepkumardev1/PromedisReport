import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReportsAction } from "../redux/actions/reportActions";
import ResponsiveAppBar from "../components/AppBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

function Reports() {
  const dispatch = useDispatch();
  const accessCode = useSelector((state: any) => state.auth?.accessCode);  
  const storedProcedureResult = useSelector((state: any) => state.report?.storedProcedureResult);
  useEffect(() => {
    dispatch(getMasterReportsAction(accessCode));
  }, [dispatch, accessCode]);

  const columns: GridColDef[] = storedProcedureResult && storedProcedureResult.length > 0
    ? Object.keys(storedProcedureResult[0]).map((key) => ({
        field: key,
        headerName: key.replace(/_/g, " "), 
        width: 150,
      }))
    : [];

  const rows = storedProcedureResult || [];
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <ResponsiveAppBar />
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows} 
          columns={columns}
          getRowId={(row) => row["id"] || row.id} 
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
        />
      </Paper>
    </>
  );
}

export default Reports;
