import React, { useState } from "react";
import { ArrowForward } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const FAQComponent = props => {
  const { question, answer, index, lastIndex } = props;
  const [isOpen, toggleOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="faqs border-none" onClick={() => toggleOpen(!isOpen)}>
          <div className="faq-question" style={{justifyContent: "space-between", display: "flex"}}>
        <span style={{fontWeight:700}}>
        {`${index}. `+ t(question)}
        </span>
        <span className={isOpen ? "faqicon rotate" : "faqicon"} style={{float: "right"}}>
            {isOpen ? <ArrowForward /> : <ArrowForward/>}
        </span>
      </div>

      <div 
        className="faq-answer" 
        style={isOpen ? { display: "block"} : { display: "none" }}
      >
        {answer?.map((obj) => 
        <span style={{color:"#000"}}>
        {t(obj.ans)}
        </span>)}
      </div>
      {!lastIndex ? <div className="cs-box-border"/> : null}
        </div>
  );
};

export default FAQComponent;