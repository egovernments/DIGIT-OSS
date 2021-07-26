import { format, toDate } from "date-fns";

export const ConvertTimestampToDate = (timestamp, dateFormat = "d-MMM-yyyy") => {
  return timestamp ? format(toDate(timestamp), dateFormat) : null;
};

export const ConvertEpochToDate = dateEpoch => {
  if(dateEpoch == null || dateEpoch == undefined || dateEpoch == ''){
    return "NA" ;
  }
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};