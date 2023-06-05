var Digit = window.Digit || {};



/* Recreated a new hook in same name*/
export const logoutV1 = async () => {
  let user = Digit.UserService.getUser();
  if (!user || !user.info || !user.access_token) return false;
  const { type } = user.info;
  const access_token = user?.access_token;
  const tenantId =
    type === "CITIZEN"
      ? Digit.ULBService.getStateId()
      : Digit.ULBService.getCurrentTenantId();
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json, text/plain, */*");
  myHeaders.append("content-type", "application/json;charset=UTF-8");
  const raw = {
    RequestInfo: {
      apiId: "Rainmaker",
      ver: ".01",
      ts: "",
      action: "_logout",
      did: "1",
      key: "",
      msgId: "20170310130900|en_IN",
      authToken: access_token,
    },
    access_token: access_token,
  };

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: "follow",
  };
  const userType = Digit.UserService.getType();
  try {
    await fetch(
      `${window.location.origin}/user/v1/_logout?tenantId=${tenantId}`,
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  } catch (e) {
  } finally {
    window.localStorage.clear();
    window.sessionStorage.clear();
    if (userType === "citizen") {
      window.location.replace("/digit-ui/citizen");
    } else {
      window.location.replace("/digit-ui/employee/user/language-selection");
    }
  }
};


