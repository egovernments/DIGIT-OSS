import { useQuery } from "react-query";
import { PTSearch } from "../../services/molecules/PT/Search";

/**
 * Custom hook which can be used to
 * get the property search using property id and tenant id 
 * and return the property generic template to show employee and citizen view
 * 
 * @author jagankumar-egov
 * 
 * @example
 *  Digit.Hooks.pt.useGenericViewProperty(t,
 *                                        tenantId, 
 *                                        propertyId,
 *                                        { // all configs supported by the usequery 
 *                                                  default:(data)=>{
 *                                                                   format
 *                                                                   return formattedData;
 *                                                                   }
 *                                        });
 * 
 * @returns {Object} Returns the object of the useQuery from react-query.
 */
const useGenericViewProperty = (t, tenantId, propertyIds, config = {}, userType) => {
  const defaultSelect = (data) => {
    return { ...data };
  };

  return useQuery(["VIEW_GENERIC_PROPERTY", propertyIds, tenantId], () => PTSearch.genericPropertyDetails(t, tenantId, propertyIds), {
    select: defaultSelect,
    ...config,
  });
};

export default useGenericViewProperty;
