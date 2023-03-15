import React, { Component } from "react";
import { getTenantId, getAccessToken } from "egov-ui-kit/utils/localStorageUtils";

class EGFFinance extends Component {
  constructor(props) {
    super(props);
    this.onFrameLoad = this.onFrameLoad.bind(this);
    this.resetIframe = this.resetIframe.bind(this);
  }
  onFrameLoad() {
    document.getElementById("erp_iframe").style.display = "block";
  }

  render() {
    let auth_token = getAccessToken(),
    locale = localStorage.getItem("locale"),
    menuUrl = this.props.location.pathname,
    loc = window.location,
    subdomainurl,
    domainurl,
    finEnv,
    hostname = loc.hostname,
    winheight = window.innerHeight - 100,
    erp_url,
    tenantId = getTenantId();
    //Reading domain name from the request url
    domainurl = hostname.substring(hostname.indexOf(".") + 1);
    // Reading environment name (ex: dev, qa, uat, fin-uat etc) from the globalconfigs if exists else reading from the .env file
    finEnv = this.globalConfigExists() ? window.globalConfigs.getConfig("FIN_ENV") : process.env.REACT_APP_FIN_ENV;
    // Preparing finance subdomain url using the above environment name and the domain url
    subdomainurl = !!(finEnv) ? "-" + finEnv + "." + domainurl : "." + domainurl;
    erp_url = loc.protocol + "//" + getTenantId().split(".")[1] + subdomainurl + menuUrl;

    return (
      <div>
        <iframe name="erp_iframe" id="erp_iframe" height={winheight} width="100%" />
        <form action={erp_url} id="erp_form" method="post" target="erp_iframe">
          <input readOnly hidden="true" name="auth_token" value={auth_token} />
          <input readOnly hidden="true" name="tenantId" value={tenantId} />
          <input readOnly hidden="true" name="locale" value={locale} />
	  <input readOnly hidden="true" name="formPage" value="true" />
        </form>
      </div>
    );
  }
  componentDidMount() {
    window.addEventListener("message", this.onMessage, false);
    window.addEventListener("loacaleChangeEvent", this.resetIframe, false);
    document.getElementById("erp_iframe").addEventListener("load", this.onFrameLoad);
  }
  componentDidUpdate() {
    let isSecure = window.location.protocol === "https";
    let localeCookie = "locale=" + localStorage.getItem("locale") + ";path=/;domain=." + this.getSubdomain();
    if (isSecure) {
      localeCookie += ";secure";
    }
    window.document.cookie = localeCookie;
    document.forms["erp_form"].submit();
  }
  onMessage = (event) => {
    if (event.data != "close") return;
    // document.getElementById('erp_iframe').style.display='none';
    this.props.history.push("/inbox");
  };
  resetIframe() {
    this.forceUpdate();
  }
  getSubdomain() {
    let hostname = window.location.hostname;
    return hostname.substring(hostname.indexOf(".") + 1);
  }
  globalConfigExists() {
    return typeof window.globalConfigs !== "undefined" && typeof window.globalConfigs.getConfig === "function";
  }
}

export default EGFFinance;
