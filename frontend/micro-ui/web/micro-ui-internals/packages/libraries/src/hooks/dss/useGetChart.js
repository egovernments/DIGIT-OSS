import { useQuery } from "react-query";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { DSSService } from "../../services/elements/DSS";

const getRequest = (type, code, requestDate, filters) => ({
  aggregationRequestDto: {
    visualizationType: type.toUpperCase(),
    visualizationCode: code,
    queryType: "",
    filters: { ...filters },
    moduleLevel: "", 
    aggregationFactors: null,
    requestDate,
  },
});
 const defaultSelect = (data) => {
 if(data?.responseData){
   if(data?.responseData?.data){
     data.responseData.data=data?.responseData?.data?.filter(col=>col)||[];
     data.responseData.data?.forEach(row=>{
       if(row?.plots){
         row.plots=row?.plots.filter(col=>col)||[];
       }
     })
     }
 }
 return data;
 }


const useGetChart = (args) => {
  const { key, type, tenantId, requestDate, filters } = args;
  return useQuery([args], () =>
    DSSService.getCharts({
      ...getRequest(type, key, requestDate, filters),
      headers: {
        tenantId,
      },
    }),
    {
      select: defaultSelect,
    }
  );
};

export default useGetChart;
