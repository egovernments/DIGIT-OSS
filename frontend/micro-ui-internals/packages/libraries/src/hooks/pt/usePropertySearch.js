import { useQuery, useQueryClient } from "react-query";

const usePropertySearch = ({ tenantId, filters, auth,searchedFrom="" }, config = {}) => {
  const client = useQueryClient();

  const args = tenantId ? { tenantId, filters, auth } : { filters, auth };

  const defaultSelect = (data) => {
    data.Properties[0].units = data.Properties[0].units || [];
    data.Properties[0].units = data.Properties[0].units.filter((unit) => unit.active);
    data.Properties[0].owners = data.Properties[0].owners || [];
    if(searchedFrom=="myPropertyCitizen"){
      data.Properties.map(property=>{
        property.owners =property.owners.filter((owner) => owner.status ===(property.creationReason=="MUTATION" ?"INACTIVE": "ACTIVE"));
      })
    }  
    return data;
  };

  const { isLoading, error, data } = useQuery(["propertySearchList", tenantId, filters, auth], () => Digit.PTService.search(args), {
    select: defaultSelect,
    ...config,
  });

  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["propertySearchList", tenantId, filters, auth]) };
};

export default usePropertySearch;
