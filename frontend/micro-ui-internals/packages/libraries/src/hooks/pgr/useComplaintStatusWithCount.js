import { useEffect, useState } from "react";
import useComplaintStatus from "./useComplaintStatus";

const useComplaintStatusCount = (complaints) => {
  const [complaintStatusWithCount, setcomplaintStatusWithCount] = useState([]);
  let complaintStatus = useComplaintStatus();

  const getCount = (value) => {
    return (
      complaints &&
      complaints.filter((complaint) => {
        return complaint.status === value;
      }).length
    );
  };

  useEffect(() => {
    let statusWithCount = complaintStatus.map((status) => ({
      ...status,
      count: getCount(status.code),
    }));
    setcomplaintStatusWithCount(statusWithCount);
  }, [complaints]);
  return complaintStatusWithCount;
};

export default useComplaintStatusCount;
