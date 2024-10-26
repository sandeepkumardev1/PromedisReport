import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReportsAction, getTableValuesAction } from "../redux/actions/reportActions";
import ResponsiveAppBar from "../components/AppBar";
import { MenuItem, Select, TextField, Grid, Paper, Box, Button, FormControl, InputLabel } from "@mui/material";
import dayjs from "dayjs";

function Reports() {
  const dispatch = useDispatch();
  const accessCode = useSelector((state: any) => state.auth?.accessCode);
  const reportDetails = useSelector((state: any) => state.report?.selectedReportDetails);

  const [formValues, setFormValues] = useState<any>({});
  const [validValuesMap, setValidValuesMap] = useState<any>({});  
  useEffect(() => {
    if (accessCode) {
      dispatch(getMasterReportsAction(accessCode));
    }
  }, [dispatch, accessCode]);

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
  }, [reportDetails]);
  const fetchValidValuesFromAPI = async (fieldName: string) => {
    try {
      const response = await dispatch(getTableValuesAction(accessCode, fieldName));

      console.log('Response Data:', response.data);
      
      const dataArray: any[] = response.data; 
      debugger
      const jsonarrray = JSON.parse(dataArray as string);
      const arrayOfObjects = jsonarrray.map((item: any) => {
        return item; //
      });
      
      console.log(arrayOfObjects);
      

console.log(arrayOfObjects);
      if (Array.isArray(dataArray)) {
        return dataArray.map((item: { idCenter: number, CenterName: string }) => {
          return { value: item.idCenter, label: item.CenterName };
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
        return dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
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

  const renderFormFields = () => {
    if (!reportDetails || !reportDetails.ReportParameters) {
      return null;
    }
  
    return reportDetails.ReportParameters.map((field: any) => {
      const { ConditionName, ControlType, DefaultValue, ValidValues } = field;
  
      const isDateField = ConditionName.toLowerCase().includes("date");
      const defaultDateValue = isDateField && DefaultValue ? getDefaultDate(DefaultValue) : "";
  
      switch (ControlType) {
        case "TEXTBOX":
          return (
            <Grid item xs={4} key={ConditionName}>
              <TextField
                fullWidth
                label={ConditionName}
                type={isDateField ? "date" : "text"}
                value={formValues[ConditionName] || defaultDateValue || ""}
                onChange={(e) => handleInputChange(ConditionName, e.target.value)}
                InputLabelProps={{
                  shrink: true,
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
                  value={formValues[ConditionName] || ""}
                  onChange={(e) => handleInputChange(ConditionName, e.target.value)}
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
  return (
    <>
      <ResponsiveAppBar />
      <Paper sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {renderFormFields()}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" color="primary" sx={{ backgroundColor: '#007BFF' }}>
                RUN
              </Button>
              <Button variant="contained" color="secondary" sx={{ backgroundColor: '#FF0000' }}>
                PDF
              </Button>
              <Button variant="contained" color="success" sx={{ backgroundColor: '#28A745' }}>
                EXCEL
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default Reports;
