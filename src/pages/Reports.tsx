import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMasterReportsAction,
  getTableValuesAction,
} from "../redux/actions/reportActions";
import ResponsiveAppBar from "../components/AppBar";
import {
  MenuItem,
  Select,
  TextField,
  Grid,
  Paper,
  Box,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

function Reports() {
  const dispatch = useDispatch();
  const accessCode = useSelector((state: any) => state.auth?.accessCode);
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
          width: 150,
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
    setReport(null)
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
        return arrayOfObjects.map(
          (item: { idCenter: number; CenterName: string }) => {
            return { value: item.idCenter, label: item.CenterName };
          }
        );
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
      `/api/ReportsManagement.svc/rest/ExecuteStoredProcedureWith?securityID=${accessCode}&procedureName=Report_Collections_Report`,
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    let data:any = await response.text();
    var test = JSON.parse(data);

    data = JSON.parse(test).map((item:any,index:number)=>({
      ...item,
      id:index
    }))

    setReport(data);
  };

  const renderFormFields = () => {
    if (!reportDetails || !reportDetails.ReportParameters) {
      return null;
    }

    return reportDetails.ReportParameters.map((field: any) => {
      const {
        ConditionName,
        ControlType,
        DefaultValue,
        ValidValues,
        SPParameterName,
      } = field;

      const isDateField = ConditionName.toLowerCase().includes("date");
      const defaultDateValue =
        isDateField && DefaultValue ? getDefaultDate(DefaultValue) : "";

      switch (ControlType) {
        case "TEXTBOX":
          return (
            <Grid item xs={4} key={ConditionName}>
              <TextField
                fullWidth
                label={ConditionName}
                type={isDateField ? "date" : "text"}
                defaultValue={defaultDateValue||""}
                onChange={(e) => {
                  var value = isDateField
                    ? e.target.value.split("-").reverse().join("-")
                    : e.target.value;
                  handleInputChange(SPParameterName, value);
                }}
              />
            </Grid>
          );

        case "COMBOBOX":
          const validOptions = ValidValues
            ? parseValidValues(ValidValues)
            : validValuesMap[ConditionName] || [];

          return (
            <Grid item xs={4} key={ConditionName}>
              <FormControl fullWidth>
                <InputLabel>{ConditionName}</InputLabel>
                <Select
                  value={formValues[SPParameterName] ||""}
                  onChange={(e) =>
                    handleInputChange(SPParameterName, e.target.value)
                  }
                  label={ConditionName}
                >
                  {validOptions.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          );

        default:
          return null;
      }
    });
  };
 
  const paginationModel = {page:0,pageSize:5}
  return (
    <>
      <ResponsiveAppBar />
      <Paper sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {renderFormFields()}

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
              >
                PDF
              </Button>
              <Button
                variant="contained"
                color="success"
                sx={{ backgroundColor: "#28A745" }}
              >
                EXCEL
              </Button>
            </Box>
          </Grid>
        </Grid>
        {report?.length > 0 && (
          <div className="mt-3">
            <DataGrid
              rows={report}
              columns={columns}
              initialState={{pagination:{paginationModel}}}
              pageSizeOptions={[5, 10]}
              columnVisibilityModel={{
                id:false
              }}
            />
          </div>
        )}
      </Paper>
    </>
  );
}

export default Reports;
