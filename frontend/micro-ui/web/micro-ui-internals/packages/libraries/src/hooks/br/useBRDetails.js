import { useQuery } from 'react-query';
import { format } from "date-fns";

const useBRDetails = (tenantId, config = {}) => {
  return useQuery(
    ['BR_DETAILS', tenantId, filters],
    () => Digit.BRService.get(data,tenantId),
    {
      select: (data) => {
        const details = [{
          title:" ",
          asSectionHeader: true,
          values: [
            { title: "EVENTS_ULB_LABEL", value: data?.tenantId },
            { title: "babyFirstName", value: data?.babyFirstName },
            { title: "babyLastName:", value: data?.babyLastName },
          ]
        }]
        return {
          applicationData: data,
          applicationDetails: details,
          tenantId: tenantId
        }
      },
      ...config
    }
  )
}

export default useBRDetails;