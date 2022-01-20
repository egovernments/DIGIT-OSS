
const useMCollectTaxHeads = (selectedCategoryType,categoriesandTypes) => {
   let TaxHeadMasterFields = [];
   TaxHeadMasterFields = categoriesandTypes && categoriesandTypes?.MdmsRes?.BillingService?.TaxHeadMaster?.filter((ob) => ob.service === selectedCategoryType?.code);
   return TaxHeadMasterFields;
};
    
export default useMCollectTaxHeads;