import { getQueryArg } from "../utils/commons";

/**
 * Example SMS URLs :
 * Generic way : "/otpLogin?mobileNo=8050579149&redirectTo={any_redirection_url}"
 * specific way : "/otpLogin?mobileNo=8050579149&redirectTo=uc-citizen/smsViewReceipt&params=pb.amritsar,05/2019-20/002226"  for UC.
 */

const getSmsRedirectionLink = (url) => {
  const redirectionTo = getQueryArg(url, "redirectTo");
  const params = getQueryArg(url, "params");
  const mobileNo = getQueryArg(url, "mobileNo");
  // if(url.includes('digit-ui')){
  //   return `/${url.split("redirectTo=")[1]}`;
  // }
  switch (redirectionTo) {
    case "uc-citizen/smsViewReceipt":
      return `/${redirectionTo}?smsLink=true&mobileNo=${mobileNo}&tenantId=${params.split(",")[0]}&receiptNo=${params.split(",")[1]}`;
    default:
      //For generic redirections & no params
      const redirectionUrl = "/" + url.split("redirectTo=")[1] + `&smsLink=true&mobileNo=${mobileNo}`;
      return redirectionUrl;
  }
};

export default getSmsRedirectionLink;
