import { format, toDate } from "date-fns";

export const ConvertTimestampToDate = (timestamp, dateFormat = "d-MMM-yyyy") => {
  return format(toDate(timestamp), dateFormat);
};
