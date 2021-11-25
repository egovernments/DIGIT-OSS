import { useQuery } from "react-query";
import { OBPSService } from "../../services/elements/OBPS";

const useInbox = ({ tenantId, filters, config }) =>
  useQuery(["INBOX_DATA", tenantId, ...Object.keys(filters)?.map((e) => filters?.[e])], () => OBPSService.scrutinyDetails(tenantId, { ...filters }), {
    ...config,
  });

const useEDCRInbox = ({ tenantId, filters, config = { retry: false, retryOnMount: false, staleTime: Infinity } }) => {
  const { filterForm, searchForm, tableForm } = filters;
  let { status, applicationType } = filterForm;
  const { applicationNo, edcrNumber } = searchForm;
  const { sortBy, limit, offset, sortOrder } = tableForm;
  const _filters = {
    tenantId,
    ...(edcrNumber ? { edcrNumber } : {}),
    ...(status ? { status } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(applicationType ? { appliactionType: applicationType } : {}),
    limit,
    offset,
  };

  return useInbox({
    tenantId,
    filters: _filters,
    config: {
      select: (data) => ({
        statuses: [],
        table: data?.edcrDetail.map((application) => ({
          applicationId: application?.applicationNumber,
          edcrNumber: application?.edcrNumber,
          date: application?.applicationDate,
          businessService: application?.applicationSubType,
          applicationType: application?.appliactionType,
          locality: application?.tenantId,
          status: application?.status,
          state: application?.status,
          owner: application?.planDetail?.planInformation?.applicantName,
          planReportUrl: application?.planReport,
          dxfFileurl: application?.dxfFile,
          sla: "NA",
        })),
        totalCount: data.count,
      }),
      ...config,
    },
  });
};

export default useEDCRInbox;
