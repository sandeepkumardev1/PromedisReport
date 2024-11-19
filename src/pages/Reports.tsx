import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReportsAction } from "../redux/actions/reportActions";
import ResponsiveAppBar from "../components/AppBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Filter from "../components/Filter";
import { CircularProgress } from "@mui/material";

function Reports() {
  const dispatch = useDispatch();
  const targetRef = useRef<any>();
  const accessCode = useSelector((state: any) => state.auth?.accessCode);
  const reportData = useSelector((state: any) => state.report?.reportData);
  const groupColumn = useSelector((state: any) => state.report?.report);
  const loader = useSelector((state: any) => state.report?.showLoader);
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
      ? Object.keys(reportData[0]).map((key, index) => ({
          field: key,
          headerName: key.replace(/_/g, " "),
          width: Math.max(getMaxLength(key) + 70, getCanvasWidth(key) + 70),
          headerClassName: "bg-slate-300",
          flex: index === Object.keys(reportData[0]).length - 1 ? 1 : 0,
          resizable: true,
          headerAlign:
            /Amt|Amount|Discount|Balance/i.test(key) ||
            !isNaN(getValueForKey(key))
              ? "right"
              : "left",
          cellClassName:
            /Amt|Amount|Discount|Balance/i.test(key) ||
            !isNaN(getValueForKey(key))
              ? "text-end"
              : "",
        }))
      : [];

  function getMaxLength(value: string) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const longestName = reportData.reduce((max: any, obj: any) => {
      if (obj[value]) {
        return context!.measureText(`${obj[value]}`).width > max
          ? context!.measureText(`${obj[value]}`).width
          : max;
      } else {
        return max;
      }
    }, 0);
    return longestName;
  }

  function getCanvasWidth(value: string) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    return context!.measureText(`${value}`).width;
  }

  function getValueForKey(key: string) {
    const value = reportData.find((item: any) => item[key] !== null);
    return value ? value[key] : "";
  }

  const paginationModel = {
    page: 0,
    pageSize: Math.min(reportData?.length, 50),
  };

  return (
    <>
      <ResponsiveAppBar />
      <div className="mt-2 mb-4">
        {reportDetails && (
          <Filter reportDetails={reportDetails} targetRef={targetRef} />
        )}
        <div className="m-3 mt-3 d-flex justify-center" ref={targetRef}>
          {reportData && reportData.length > 0 ? (
            !loader ? (
              <div className="w-[max-content] overflow-x-scroll data-grid">
                <DataGrid
                  rows={reportData}
                  columns={columns}
                  scrollbarSize={20}
                  sx={{ overflowX: "scroll" }}
                  rowHeight={24}
                  columnHeaderHeight={40}
                  getRowClassName={(params) => {
                    return params.row[groupColumn.GroupingColumnName]?.includes(
                      "Total"
                    ) ||
                      params.row[Object.keys(reportData[0])[0]]?.includes(
                        "Total"
                      )
                      ? "bg-blue-300"
                      : "";
                  }}
                  initialState={{
                    pagination: { paginationModel },
                  }}
                  slotProps={{
                    pagination: {
                      showFirstButton: true,
                      showLastButton: true,
                    },
                  }}
                  pageSizeOptions={[20, 40, 50, 100]}
                  columnVisibilityModel={{
                    id: false,
                  }}
                />
              </div>
            ) : (
              <CircularProgress className="mt-[5rem]" />
            )
          ) : !loader ? (
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center mt-[5rem]">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                No Data Available
              </h2>
              <p className="text-gray-500">
                There is currently no data to display.
              </p>
            </div>
          ) : (
            <>
              <CircularProgress className="mt-[5rem]" />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Reports;
