import { Header, TextInput, SearchIconSvg, ArrowForward, Loader, BackButton} from "@egovernments/digit-ui-react-components";
import React, { useState, Fragment, useRef, useEffect}from "react";
import { useTranslation } from "react-i18next";
import FaqComponent from "./FaqComponent";


const FAQsSection = ({module}) => {
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.tenantId || Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();

  const SearchImg = () => {
    return <SearchIconSvg className="signature-img" />;
  };

  const { isLoading, data } = Digit.Hooks.useGetFAQsJSON(Digit.ULBService.getStateId());

  const moduleFaqs = data?.MdmsRes["common-masters"]?.faqs[0]?.[`${module}`].faqs;

  if(isLoading){
    return <Loader/>
  }
  return (
    <Fragment>
    <div className="faq-page">
      <BackButton style={{marginLeft : "unset"}}></BackButton>
        <div style={{ marginBottom: "15px" }}>
          <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px"}}>{t("FAQ_S")}</Header>
        </div>
        <div className="faq-list">
        {moduleFaqs.map((faq, i) => (
          <FaqComponent key={"faq_" + i} question={faq.question} answer={faq.answer} subAnswer={faq.subAnswer ? faq.subAnswer : ""} lastIndex={i === (moduleFaqs?.length - 1)}/>
        ))}
        </div>
    </div>
    </Fragment>
  );
};

export default FAQsSection;