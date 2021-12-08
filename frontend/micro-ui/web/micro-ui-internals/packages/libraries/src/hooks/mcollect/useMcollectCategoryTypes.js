const useMCollectCategoryTypes = (selectedCategory,categoriesandTypes) => {
let categorieTypes = [];
categoriesandTypes && selectedCategory && categoriesandTypes?.MdmsRes?.BillingService?.BusinessService?.filter((ob) => ob.code.split(".")[0] === selectedCategory.code.split(".")[0]).map((type) =>{
    categorieTypes.push({...type, i18nkey: `BILLINGSERVICE_BUSINESSSERVICE_${type.code.toUpperCase().replaceAll(".","_")}`})
});
return categorieTypes;
};


export default useMCollectCategoryTypes;