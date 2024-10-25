import * as api from "../api/reportsAPI";
import { getMasterReports } from "../reducers/reports";

export const getMasterReportsAction: any =  (securityId:string) => async (dispatch:any) => {
    try{
        const { data, error } = await api.getMasterReports(securityId);
        if(error){

        }else{
            dispatch(getMasterReports(data));
        }
    }catch(error:any){

    }
}