import { useQuery } from "react-query";
import { endOfToday, start } from "date-fns";

import { format, subMonths } from "date-fns";

const useDynamicData = ({moduleCode ,tenantId, filters, t }) => {


    switch(moduleCode){

        default:
            return {isLoading: false, error: false, data: null, isSuccess: false};
    }
    
  };

export default useDynamicData;