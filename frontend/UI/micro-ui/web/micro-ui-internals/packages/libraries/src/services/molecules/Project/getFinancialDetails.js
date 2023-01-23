const transformViewDataToApplicationDetails = {
    genericPropertyDetails: () => {
      const FinancialDetails = {
        title: " ",
        asSectionHeader: false,
        values: [
          { title: "WORKS_FUND", value: "Housing and Urban Development Department" },
          { title: "WORKS_FUNCTION", value: "Housing and Urban Development Department" },
          { title: "WORKS_BUDGET_HEAD", value: "Local Slums" },
          { title: "WORKS_SCHEME", value: "201/A  - 19 December 2021" },
          { title: "WORKS_SUB_SCHEME", value: "5,00,000" },
        ],
      };
      const applicationDetails = { applicationDetails: [FinancialDetails] };
      return {
        applicationDetails,
      };
    },
  };
  
  //Write Service to fetch records
  export const getFinancialDetails = async(tenantId, projectID) => {
    return transformViewDataToApplicationDetails.genericPropertyDetails();
  };
  