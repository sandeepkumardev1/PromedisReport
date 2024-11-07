import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReportsAction } from "../redux/actions/reportActions";
import ResponsiveAppBar from "../components/AppBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Filter from "../components/Filter";

function Reports() {
  const dispatch = useDispatch();
  const targetRef = useRef<any>();
  const accessCode = useSelector((state: any) => state.auth?.accessCode);
  const reportData = useSelector((state: any) => state.report?.reportData);
  const reportDetails = useSelector(
    (state: any) => state.report?.reportDetails
  );

  useEffect(() => {
    if (accessCode) {
      dispatch(getMasterReportsAction(accessCode));
    }
  }, [dispatch, accessCode]);

  const columns: GridColDef[] =
    reportData && reportData.length > 0
      ? Object.keys(reportData[0]).map((key) => ({
          field: key,
          headerName: key.replace(/_/g, " "),
          width: 175,
          headerClassName: "bg-slate-300 h-[0rem]",
          flex: 1,
        }))
      : [];

  const paginationModel = {
    page: 0,
    pageSize: Math.min(reportData?.length, 50),
  };
  // const reportData1 = reportData?.reduce((ob:any, item:any) => ({...ob, [report.GroupingColumnName]: [...ob[report.GroupingColumnName] ?? [], item]}), {})
  // const value = Object.values(reportData1 ?? []).flat()

  return (
    <>
      <ResponsiveAppBar />
      <div className="mt-2 mb-4">
        {reportDetails && <Filter reportDetails={reportDetails} targetRef={targetRef} />}
        <div className="m-3 mt-3 d-flex justify-center" ref={targetRef}>
          {reportData && reportData.length > 0 ? (
            <DataGrid
              rows={reportData}
              columns={columns}
              rowHeight={40}
              initialState={{
                pagination: { paginationModel },
              }}
              pageSizeOptions={[5, 10]}
              columnVisibilityModel={{
                id: false,
              }}
            />
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                No Data Available
              </h2>
              <p className="text-gray-500">
                There is currently no data to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Reports;
