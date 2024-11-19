import { Button } from "@mui/material";
import { exportToExcel, exportToPdf, getDefaultDate } from "../utils/utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReportDataAction,
  getTableValuesAction,
} from "../redux/actions/reportActions";
import {
  hideLoader,
  setReportData,
  showLoader,
} from "../redux/reducers/reports";

type FilterProps = {
  reportDetails: any;
  targetRef?: any;
};

function Filter({ reportDetails }: FilterProps) {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<any>({});
  const [AppliedFilters, setAppliedFilters] = useState<any>({});
  const accessCode = useSelector((state: any) => state.auth?.accessCode);
  const report = useSelector((state: any) => state.report?.report);
  const reportData = useSelector((state: any) => state.report?.reportData);
  const [validValues, setValidValues] = useState<any>({});
  const storedProcedure = useSelector(
    (state: any) => state.report?.storedProcedure
  );

  const handleInputChange = (field: any, value: any, ConditionName: string) => {
    const data = JSON.parse(value);
    setAppliedFilters((prevValues: any) => ({
      ...prevValues,
      [ConditionName]: data.label,
    }));

    setFilter((prevValues: any) => ({
      ...prevValues,
      [field]: data.value,
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
      var conditionNames: any = new Object();
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

          conditionNames[ConditionName] = defaultDateValue
            .split("-")
            .reverse()
            .join("-");
        }
      });
      setFilter(dateFields);
      setAppliedFilters(conditionNames);
    }
    setDefaultValue();
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
                handleInputChange(SPParameterName, JSON.stringify({label:value,value}), ConditionName);
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
                handleInputChange(
                  SPParameterName,
                  e.target.value,
                  ConditionName
                )
              }
            >
              {!ValidValues && (
                <option
                  value={
                    typeof validOptions?.at(0)?.value == "string" ? "ALL" : 0
                  }
                  selected={MandatoryFlag == "N"}
                >
                  Select
                </option>
              )}
              {validOptions.map((item: any) => (
                <option value={JSON.stringify(item)} key={item.value}>
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

  function setDefaultValue() {
    var defaultOptions: any = new Object();
    var defaultNames:any = new Object();

    reportDetails.ReportParameters.map((field: any) => {
      const { ConditionName, ControlType, ValidValues, SPParameterName } =
        field;

      if (ControlType === "COMBOBOX") {
        const validOptions: any = ValidValues
          ? parseValidValues(ValidValues)
          : validValues[ConditionName] || [];
        defaultOptions[SPParameterName] = ValidValues
          ? validOptions[0].value
          : 0;
          defaultNames[ConditionName] = ValidValues
          ? validOptions[0].value
          : 0;
      }
    });
    setFilter((prevValues: any) => ({
      ...prevValues,
      ...defaultOptions,
    }));

    setAppliedFilters((prevValues: any) => ({
      ...prevValues,
      ...defaultNames,
    }));
  }

  function parseValidValues(validValues: string) {
    return validValues.split(",").map((v: string) => {
      const [value, label] = v.split(":");
      return { value: value.trim(), label: label.trim() };
    });
  }

  function downloadFile(format: string) {
    if (format === "excel") {
      exportToExcel(reportData, report?.ReportName,AppliedFilters);
    } else {
      exportToPdf(
        reportData,
        report?.ReportName,
        report.PDFPrintOrientation.toLowerCase(),
        AppliedFilters
      );
    }
  }

  async function getReportData() {
    dispatch(showLoader());
    await dispatch(
      getReportDataAction(
        filter,
        accessCode,
        storedProcedure,
        report.GroupingColumnName
      )
    );
    dispatch(hideLoader());
  }

  return (
    <div>
      <div className="d-flex mx-2 mt-4">
        {ReportFilter}
        <div className="absolute left-[79.1rem] top-[4rem] d-flex justify-start w-[16rem]">
          <h1 className="fw-bold">{report?.ReportName}</h1>
        </div>
      </div>
      <div className="absolute left-[79.1rem] top-[6.4rem] d-flex justify-center w-[16rem]">
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#007BFF", flex: 1 }}
          onClick={getReportData}
        >
          RUN
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="mx-2"
          sx={{ backgroundColor: "#FF0000", flex: 1 }}
          onClick={() => downloadFile("pdf")}
          disabled={reportData == null || reportData?.length <= 0}
        >
          PDF
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ backgroundColor: "#28A745", flex: 1 }}
          onClick={() => downloadFile("excel")}
          disabled={reportData == null || reportData?.length <= 0}
        >
          EXCEL
        </Button>
      </div>
    </div>
  );
}

export default Filter;
