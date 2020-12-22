import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getComplaintFilter } from "../Services/ComplaintFilter";

const useInboxData = (searchParams) => {
  console.log("searchParams--------:", searchParams);
  const [complaintList, setcomplaintList] = useState([]);
  let filters = { start: 1, end: 10, ...searchParams.filters, ...searchParams.search };

  const complaintFilter = getComplaintFilter();

  useEffect(async () => {
    const response = await complaintFilter.getComplaintResponse(filters);
    setcomplaintList(response);
  }, [searchParams]);
  return complaintList;
};

export default useInboxData;
