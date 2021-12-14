import {
    Card, CardHeader, Header, LinkButton, Row, StatusTable, SubmitBar, Table, CardSectionHeader, OpenLinkContainer, BackButton, EditIcon
  } from "@egovernments/digit-ui-react-components";
  import React,{ useMemo }  from "react";
  import { useTranslation } from "react-i18next";
  import { useHistory, useRouteMatch } from "react-router-dom";
  import Timeline from "../../../components/Timeline";
  import OBPSDocument from "../../../pageComponents/OBPSDocuments";
  
  const CheckPage = ({ onSubmit, value }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch();
    let user = Digit.UserService.getUser()
    const tenantId = user &&  user?.info && user?.info?.permanentCity ? user?.info?.permanentCity : Digit.ULBService.getCurrentTenantId();
    let isopenlink = window.location.href.includes("/openlink/");
    const isCitizenUrl = Digit.Utils.browser.isMobile()?true:false;

    const { result, formData, documents} = value;
    let consumerCode=value?.result?.Licenses[0].applicationNumber;
    const fetchBillParams = { consumerCode };



      const {data:paymentDetails} = Digit.Hooks.obps.useBPAREGgetbill(
        { businessService: "BPAREG", ...fetchBillParams, tenantId: tenantId },
        {
          enabled: consumerCode ? true : false,
          retry: false,
        }
      );

      let routeLink = isopenlink?`/digit-ui/citizen/obps/openlink/stakeholder/apply`:`/digit-ui/citizen/obps/stakeholder/apply`;

      function routeTo(jumpTo) {
        location.href=jumpTo;
    }


    return (
    <React.Fragment>
    <div className={isopenlink? "OpenlinkContainer":""}>
    {/* {isopenlink &&<OpenLinkContainer />} */}
    <div style={isopenlink?{ width:isCitizenUrl?"100%":"70%", marginLeft:"auto",marginRight:"auto"}:{}}>
    {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
    <Timeline currentStep={4} flow="STAKEHOLDER" />
    <Header>{t("BPA_STEPPER_SUMMARY_HEADER")}</Header>
    <Card>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_APPLICATION_NUMBER_LABEL`)} text={result?.Licenses?.[0]?.applicationNumber?result?.Licenses?.[0]?.applicationNumber:""} />
        </StatusTable>
    </Card>
    <Card>
    <CardHeader>{t(`BPA_LICENSE_DETAILS_LABEL`)}</CardHeader>
    <LinkButton
              label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
              style={{ width: "100px", display:"inline" }}
              onClick={() => routeTo(`${routeLink}/provide-license-type`)}
           />
        <StatusTable>
          <Row className="border-none" label={t(`BPA_LICENSE_TYPE`)} text={t(formData?.LicneseType?.LicenseType?.i18nKey)} />
          {formData?.LicneseType?.LicenseType?.i18nKey.includes("ARCHITECT") && <Row className="border-none" label={t(`BPA_COUNCIL_NUMBER`)} text={formData?.LicneseType?.ArchitectNo}/>}
        </StatusTable>
    </Card>
    <Card>
    <CardHeader>{t(`BPA_LICENSE_DET_CAPTION`)}</CardHeader>
    <LinkButton
              label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
              style={{ width: "100px", display:"inline" }}
              onClick={() => routeTo(`${routeLink}/license-details`)}
           />
        <StatusTable>
          <Row className="border-none" label={t(`BPA_APPLICANT_NAME_LABEL`)} textStyle={{marginLeft:"9px"}} text={t(formData?.LicneseDetails?.name)} />
          <Row className="border-none" label={t(`BPA_APPLICANT_GENDER_LABEL`)} text={t(formData?.LicneseDetails?.gender.i18nKey)}/>
          <Row className="border-none" label={t(`BPA_OWNER_MOBILE_NO_LABEL`)} text={formData?.LicneseDetails?.mobileNumber}/>
          <Row className="border-none" label={t(`BPA_APPLICANT_EMAIL_LABEL`)} text={formData?.LicneseDetails?.email || t("CS_NA")}/>
          <Row className="border-none" label={t(`BPA_APPLICANT_PAN_NO`)} text={formData?.LicneseDetails?.PanNumber || t("CS_NA")}/>
        </StatusTable>
    </Card>
    <Card>
    <div style={{marginRight:"24px"}}>
    <CardHeader>{t(`BPA_LICENSEE_PERMANENT_LABEL`)}</CardHeader>
    </div>
    <LinkButton
              label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
              style={{ width: "100px", display:"inline" }}
              onClick={() => routeTo(`${routeLink}/Permanent-address`)}
           />
    <Row className="border-none" text={t(formData?.LicneseDetails?.PermanentAddress)} />
    </Card>
    <Card>
    <div style={{marginRight:"24px"}}>
    <CardHeader>{t(`BPA_COMMUNICATION_ADDRESS_HEADER_DETAILS`)}</CardHeader>
    </div>
    <LinkButton
              label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
              style={{ width: "100px", display:"inline" }}
              onClick={() => routeTo(`${routeLink}/correspondence-address`)}
           />
    <Row className="border-none" text={t(value?.Correspondenceaddress)} />
    </Card>
    <Card>
      <CardHeader>{t("BPA_DOC_DETAILS_SUMMARY")}</CardHeader>
      <LinkButton
              label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
              style={{ width: "100px", display:"inline" }}
              onClick={() => routeTo(`${routeLink}/stakeholder-document-details`)}
           />
      {documents?.documents.map((doc, index) => (
        <div key={index}>
        <CardSectionHeader>{t(`BPAREG_HEADER_${doc?.documentType?.replace('.', '_')}`)}</CardSectionHeader>
        {doc?.info ? <div style={{fontSize: "12px", color: "#505A5F", fontWeight: 400, lineHeight: "15px"}}>{`${t(doc?.info)}`}</div> : null}
        <StatusTable>
        <OBPSDocument value={value} Code={doc?.documentType} index={index} isNOC={false} svgStyles={{}} isStakeHolder={true}/> 
        {documents?.documents?.length != index + 1 ? <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/> : null }
        </StatusTable>
        </div>
      ))}
      </Card>
      <Card>
      <CardHeader>{t("BPA_SUMMARY_FEE_EST")}</CardHeader>
      <StatusTable>
      {paymentDetails?.billResponse?.Bill[0]?.billDetails[0]?.billAccountDetails.map((bill,index)=>(
        <div key={index}>
          <Row className="border-none" label={t(`${bill.taxHeadCode}`)} text={`₹ ${bill?.amount}`|| t("CS_NA")} />
        </div>
      ))}
      <Row className="border-none" label={t(`BPA_COMMON_TOTAL_AMT`)} text={`₹ ${paymentDetails?.billResponse?.Bill?.[0]?.billDetails[0]?.amount}`|| t("CS_NA")} />
       </StatusTable>
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      <CardHeader>{t("BPA_COMMON_TOTAL_AMT")}</CardHeader> 
      <CardHeader>₹ {paymentDetails?.billResponse?.Bill?.[0]?.billDetails[0]?.amount}</CardHeader> 
      <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
      </Card>
    </div>
    </div>
    </React.Fragment>
    );
  };
  
  export default CheckPage;