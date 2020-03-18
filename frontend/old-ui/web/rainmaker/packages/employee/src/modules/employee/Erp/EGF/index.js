import React, { Component } from "react";
import { getTenantId, getAccessToken } from "egov-ui-kit/utils/localStorageUtils";

class EGFFinance extends Component {
  constructor(props) {
    super(props);
    this.onFrameLoad = this.onFrameLoad.bind(this);
    this.resetIframe = this.resetIframe.bind(this);
  }
  onFrameLoad() {
    console.log("iframe got loaded");
    document.getElementById("erp_iframe").style.display = "block";
  }

  render() {
    let auth_token = getAccessToken(),
      locale = localStorage.getItem("locale"),
      menuUrl = this.props.location.pathname,
      loc = window.location,
      subdomainurl,
      hostname = loc.hostname,
      winheight = window.innerHeight - 100,
      erp_url,
      tenantId = getTenantId();

    if (hostname.search("dev") != -1) {
      subdomainurl = hostname.substring(hostname.search("dev"), hostname.length);
      erp_url = loc.protocol + "//" + getTenantId().split(".")[1] + "-" + subdomainurl + menuUrl;
    } else if (hostname.search("qa") != -1) {
      subdomainurl = hostname.substring(hostname.search("qa"), hostname.length);
      erp_url = loc.protocol + "//" + getTenantId().split(".")[1] + "-" + subdomainurl + menuUrl;
    } else if (hostname.search("uat") != -1) {
      // subdomainurl = hostname.substring(hostname.search('uat'),hostname.length);
      subdomainurl = "uat.egovernments.org";
      erp_url = loc.protocol + "//" + getTenantId().split(".")[1] + "-" + subdomainurl + menuUrl;
    } else {
      subdomainurl = hostname.substring(hostname.indexOf(".") + 1);
      erp_url = loc.protocol + "//" + getTenantId().split(".")[1] + "." + subdomainurl + menuUrl;
    }

    // let erp_url='http://jalandhar.test.egov.com:8080'+menuUrl;
    console.log("ERP URL : " + erp_url);

    return (
      <div>
        <iframe name="erp_iframe" id="erp_iframe" height={winheight} width="100%" />
        <form action={erp_url} id="erp_form" method="post" target="erp_iframe">
          <input readOnly hidden="true" name="auth_token" value={auth_token} />
          <input readOnly hidden="true" name="tenantId" value={tenantId} />
          <input readOnly hidden="true" name="locale" value={locale} />
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
    console.log("event recieved from iframe client");
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
}

export default EGFFinance;
