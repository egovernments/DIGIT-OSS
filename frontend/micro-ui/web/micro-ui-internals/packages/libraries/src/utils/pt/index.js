export const getPropertyTypeLocale = (value) => {
  return `PROPERTYTAX_BILLING_SLAB_${value?.split(".")[0]}`;
};

export const getPropertySubtypeLocale = (value) => `PROPERTYTAX_BILLING_SLAB_${value}`;
