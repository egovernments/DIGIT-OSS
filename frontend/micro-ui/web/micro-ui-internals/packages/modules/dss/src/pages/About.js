import { Card, Loader, Header, CardSubHeader } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
const About = () => {
  const { t } = useTranslation();
  const { isLoading, data } = Digit.Hooks.useGetDSSAboutJSON(Digit.ULBService.getStateId());
  const moduleAbout = data?.MdmsRes["dss-dashboard"]?.About[0]?.[`DSS`].About;
  const definitionlist = (defineObj) => {
    let array = [];
    for (var i = 0; i < defineObj.length; i++) {
      array.push(t(defineObj[i]));
    }
    return array.join(" ");
  }
    if (isLoading) {
    return <Loader />
  }
  return (
    <Fragment>
      <Header styles={{ marginLeft: "15px", paddingTop: "10px", fontSize: "36px" }}>{t("DSS_ABOUT_DASHBOARD")}</Header>
      <Card>{moduleAbout.map((obj) => (
        <div>
          <CardSubHeader style={{ marginBottom: "0", fontSize: "24px" , marginBottom:"10px"}} >{t(obj?.titleHeader)}</CardSubHeader>
          <div style={{ fontSize: "16px" ,marginBottom:"20px"}}>{definitionlist(obj?.define)}</div>
          {obj?.definePoints ?
            <div>
              {obj?.definePoints?.map((about, i) => (
                <div style={{ fontSize: "16px", marginLeft: "15px",marginBottom:"20px" }}>{"•"}<div style={{ marginTop: "-25px", marginLeft:"15px"}}>{t(about?.point)}</div></div>
              ))}
            </div> : null}
            <div style={{ fontSize: "16px" ,marginBottom:"20px"}}>{t(obj?.subdefine)}</div> 
            {obj?.subdefinePoints ?
            <div>
              {obj?.subdefinePoints?.map((about, i) => (
                <div style={{ fontSize: "16px", marginLeft: "15px",marginBottom:"20px" }}>{"•"}<div style={{ marginTop: "-25px", marginLeft:"15px"}}>{t(about?.point)}</div></div>
              ))}
            </div> : null}
        </div>
      ))}</Card>
    </Fragment>
  );
};
export default About;