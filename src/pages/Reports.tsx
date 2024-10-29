import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMasterReportsAction,
  getTableValuesAction,
} from "../redux/actions/reportActions";
import ResponsiveAppBar from "../components/AppBar";
import {Box, Button } from "@mui/material";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { exportToExcel, exportToPdf } from "../utils/utils";

function Reports() {
  const dispatch = useDispatch();
  const accessCode = useSelector((state: any) => state.auth?.accessCode);
  const _report = useSelector((state: any) => state.report?.report);
  const storedProcedure = useSelector(
    (state: any) => state.report?.storedProcedure
  );
  const reportDetails = useSelector(
    (state: any) => state.report?.selectedReportDetails
  );
  const [formValues, setFormValues] = useState<any>({});
  const [validValuesMap, setValidValuesMap] = useState<any>({});
  const [report, setReport] = useState<any>();

  useEffect(() => {
    if (accessCode) {
      dispatch(getMasterReportsAction(accessCode));
    }
  }, [dispatch, accessCode]);

  const columns: GridColDef[] =
    report && report.length > 0
      ? Object.keys(report[0]).map((key) => ({
          field: key,
          headerName: key.replace(/_/g, " "),
          width: 175,
          headerClassName: 'bg-slate-300',
          flex:1
        }))
      : [];

  useEffect(() => {
    if (reportDetails?.ReportParameters) {
      reportDetails.ReportParameters.forEach(async (field: any) => {
        if (!field.ValidValues && field.ControlType === "COMBOBOX") {
          const fetchedValues = await fetchValidValuesFromAPI(field.TableName);

          setValidValuesMap((prevMap: any) => ({
            ...prevMap,
            [field.ConditionName]: fetchedValues,
          }));
        }
      });
    }
    setReport(null);
    setFormValues({});

    if (reportDetails) {
      var dateFields: any = new Object();
      reportDetails.ReportParameters.map((field: any) => {
        const { ConditionName, DefaultValue, SPParameterName } = field;
        const isDateField = ConditionName.toLowerCase().includes("date");
        const defaultDateValue =
          isDateField && DefaultValue ? getDefaultDate(DefaultValue) : "";

        if (isDateField) {
          dateFields[SPParameterName] = defaultDateValue
            .split("-")
            .reverse()
            .join("-");
        }
      });
      setFormValues(dateFields);
    }
  }, [reportDetails]);

  const fetchValidValuesFromAPI = async (fieldName: string) => {
    try {
      const response = await dispatch(
        getTableValuesAction(accessCode, fieldName)
      );
      const jsonarrray = JSON.parse(response.data as string);
      const arrayOfObjects: any = jsonarrray.map((item: any) => {
        return item;
      });
      if (Array.isArray(arrayOfObjects)) {
        return arrayOfObjects.map((item: any) => {
          var values = Object.keys(item);
          return { value: item[values[0]], label: item[values[1]] };
        });
      } else {
        throw new Error("Expected an array but did not find one.");
      }
    } catch (error) {
      console.error("Error fetching valid values", error);
      return [];
    }
  };

  const handleInputChange = (field: any, value: any) => {
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const getDefaultDate = (defaultValue: string) => {
    switch (defaultValue) {
      case "SYSDATE":
        return dayjs().format("YYYY-MM-DD");
      case "YESTERDAY":
        return dayjs().subtract(1, "day").format("YYYY-MM-DD");
      case "FIRSTDAYPREVIOUSMONTH":
        return dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD");
      case "LASTDAYPREVIOUSMONTH":
        return dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
      default:
        return "";
    }
  };

  const parseValidValues = (validValues: string) => {
    return validValues.split(",").map((v: string) => {
      const [value, label] = v.split(":");
      return { value: value.trim(), label: label.trim() };
    });
  };

  const fetchReports = async () => {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      parameters: JSON.stringify(formValues),
    });

    let response = await fetch(
      `/api/ReportsManagement.svc/rest/ExecuteStoredProcedureWith?securityID=${accessCode}&procedureName=${storedProcedure}`,
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    let data: any = await response.text();
    var test = JSON.parse(data);

    data = JSON.parse(test).map((item: any, index: number) => ({
      ...item,
      id: index,
    }));

    setReport(data);
  };

  const renderFormFields = () => {
    if (!reportDetails || !reportDetails.ReportParameters) {
      return null;
    }
    var parameters = reportDetails.ReportParameters;
    return parameters.map((field: any) => {
      const {
        ConditionName,
        ControlType,
        DefaultValue,
        ValidValues,
        SPParameterName,
        MandatoryFlag,
      } = field;

      const isDateField = ConditionName.toLowerCase().includes("date");
      const defaultDateValue =
        isDateField && DefaultValue ? getDefaultDate(DefaultValue) : "";

      switch (ControlType) {
        case "TEXTBOX":
          return (
            <div className="col-md-2 mx-4">
              <label className="text-[0.9rem]">
                {ConditionName}
                {MandatoryFlag == "Y" && <span className="text-danger">*</span>}
              </label>
              <input
                type={isDateField ? "date" : "text"}
                key={_report.ReportName + SPParameterName}
                defaultValue={defaultDateValue}
                className="form-control m-1"
                onChange={(e: any) => {
                  var value = isDateField
                    ? e.target.value.split("-").reverse().join("-")
                    : e.target.value;
                  handleInputChange(SPParameterName, value);
                }}
              />
            </div>
          );

        case "COMBOBOX":
          const validOptions = ValidValues
            ? parseValidValues(ValidValues)
            : validValuesMap[ConditionName] || [];

          return (
            <div className="col-md-2 mx-4">
              <label className="text-[0.9rem]">{ConditionName}</label>
              <select
                key={SPParameterName + _report.ReportName}
                className="form-select m-1"
                onChange={(e) =>
                  handleInputChange(SPParameterName, e.target.value)
                }
              >
                <option
                  value={
                    typeof validOptions?.at(0)?.value == "string" ? "ALL" : 0
                  }
                  selected={MandatoryFlag == "N"}
                >
                  Select
                </option>
                {validOptions.map((item: any) => (
                  <option value={item.value} key={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          );

        default:
          return null;
      }
    });
  };

  function downloadFile(format: string) {
    if (format === "excel") {
      exportToExcel(report, _report?.ReportName);
    } else {
      exportToPdf(
        report,
        _report?.ReportName,
        _report.PDFPrintOrientation.toLowerCase()
      );
    }
  }

  const paginationModel = { page: 0, pageSize: Math.min(report?.length, 50) };
  return (
    <>
      <ResponsiveAppBar />
      <div className="mt-2 mb-4">
        <div className="row">{renderFormFields()}</div>
        <div className="absolute left-[79rem] top-[5rem] d-flex justify-center w-[16rem]">
          <h1 className="fw-bold text-1xl">{_report?.ReportName}</h1>
        </div>
        <Box
          sx={{ display: "flex", gap: 2 }}
          className="justify-end mx-4"
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: "#007BFF" }}
            onClick={fetchReports}
          >
            RUN
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ backgroundColor: "#FF0000" }}
            onClick={() => downloadFile("pdf")}
            disabled={report == null || report?.length <= 0}
          >
            PDF
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ backgroundColor: "#28A745" }}
            onClick={() => downloadFile("excel")}
            disabled={report == null || report?.length <= 0}
          >
            EXCEL
          </Button>
        </Box>
      </div>
      {report?.length > 0 && (
        <div className="m-3 mt-3">
          <DataGrid
            rows={report}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            columnVisibilityModel={{
              id: false,
            }}
          />
        </div>
      )}
    </>
  );
}

export default Reports;
