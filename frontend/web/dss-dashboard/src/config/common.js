let tenent = `${localStorage.getItem('tenant-id')}` ? (`${localStorage.getItem('tenant-id')}`).split('.')[0] : ''

const commonConfig = {
  MAP_API_KEY: "AIzaSyBN01pR2wGavj2_q3v4-vFgQzmcx-gllk0",
  tenantId: tenent,
  forgotPasswordTenant: `${localStorage.getItem('tenant-id')}`
};

export default commonConfig;
