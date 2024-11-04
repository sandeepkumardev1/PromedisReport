import { Box, Button } from "@mui/material";
import { exportToExcel, exportToPdf, getDefaultDate } from "../utils/utils";
// import generatePDF from "react-to-pdf";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReportDataAction,
  getTableValuesAction,
} from "../redux/actions/reportActions";
import { setReportData } from "../redux/reducers/reports";

type FilterProps = {
  reportDetails: any;
  targetRef?: any;
};

function Filter({ reportDetails}: FilterProps) {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<any>({});
  const accessCode = useSelector((state: any) => state.auth?.accessCode);
  const report = useSelector((state: any) => state.report?.report);
  const reportData = useSelector((state: any) => state.report?.reportData);
  const [validValues, setValidValues] = useState<any>({});
  const storedProcedure = useSelector(
    (state: any) => state.report?.storedProcedure
  );

  const handleInputChange = (field: any, value: any) => {
    setFilter((prevValues: any) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (reportDetails?.ReportParameters) {
      reportDetails.ReportParameters.forEach(async (field: any) => {
        if (!field.ValidValues && field.ControlType === "COMBOBOX") {
          const fetchedValues = await fetchValidValuesFromAPI(field.TableName);
          setValidValues((prevMap: any) => ({
            ...prevMap,
            [field.ConditionName]: fetchedValues,
          }));
        }
      });
    }
    dispatch(setReportData(null));
    setFilter({});
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
      setFilter(dateFields);
    }
  }, [reportDetails]);

  const fetchValidValuesFromAPI = async (fieldName: string) => {
    try {
      const response = await getTableValuesAction(accessCode, fieldName);
      const data = JSON.parse(response.data as string);
      if (Array.isArray(data)) {
        return data.map((item: any) => {
          var keys = Object.keys(item);
          return { value: item[keys[0]], label: item[keys[1]] };
        });
      }
    } catch (error) {
      console.error("Error fetching valid values", error);
    }
  };

  var ReportFilter = reportDetails.ReportParameters.map((field: any) => {
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
          <div className="col-md-2 mx-1">
            <label className="text-[0.9rem]">
              {ConditionName}
              {MandatoryFlag == "Y" && <span className="text-danger">*</span>}
            </label>
            <input
              type={isDateField ? "date" : "text"}
              key={report.ReportName + SPParameterName}
              defaultValue={defaultDateValue}
              className="form-control"
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
        const validOptions: any = ValidValues
          ? parseValidValues(ValidValues)
          : validValues[ConditionName] || [];

        return (
          <div className="col-md-2 mx-1">
            <label className="text-[0.9rem]">{ConditionName}</label>
            <select
              key={SPParameterName + report.ReportName}
              className="form-select"
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

  function parseValidValues(validValues: string) {
    return validValues.split(",").map((v: string) => {
      const [value, label] = v.split(":");
      return { value: value.trim(), label: label.trim() };
    });
  }

  function downloadFile(format: string) {
    if (format === "excel") {
      exportToExcel(reportData, report?.ReportName);
    } else {
      exportToPdf(
        reportData,
        report?.ReportName,
        report.PDFPrintOrientation.toLowerCase()
      );
    }
  }

  async function getReportData() {
    await dispatch(getReportDataAction(filter, accessCode, storedProcedure));
  }

  return (
    <div>
      <div className="d-flex mx-2">{ReportFilter}</div>
      <div className="absolute left-[80rem] top-[5rem] d-flex justify-center w-[16rem]">
        <h1 className="fw-bold text-1xl">{report?.ReportName}</h1>
      </div>
      <Box sx={{ display: "flex", gap: 2 }} className="justify-end mx-4">
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#007BFF" }}
          onClick={getReportData}
        >
          RUN
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ backgroundColor: "#FF0000" }}
            onClick={() => downloadFile("pdf")}
          // onClick={() => generatePDF(targetRef, { filename: "page.pdf" })}
          disabled={reportData == null || reportData?.length <= 0}
        >
          PDF
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ backgroundColor: "#28A745" }}
          onClick={() => downloadFile("excel")}
          disabled={reportData == null || reportData?.length <= 0}
        >
          EXCEL
        </Button>
      </Box>
    </div>
  );
}

export default Filter;
