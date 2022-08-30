import React, { useState } from "react";
import { ArrowForward } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const FaqComponent = props => {
  const { question, answer, subAnswer, lastIndex } = props;
  const [isOpen, toggleOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="faqs border-none" onClick={() => toggleOpen(!isOpen)}>
          <div className="faq-question" style={{justifyContent: "space-between", 
          display: Digit.Utils.browser.isMobile() && t(question).length > 42 && isOpen ? "block" : "flex"}}>
        <span>
        {t(question)}
        </span>
        <span className={isOpen ? "faqicon rotate" : "faqicon"} style={{float: "right"}}>
            {isOpen ? <ArrowForward /> : <ArrowForward/>}
        </span>
      </div>

      <div 
        className="faq-answer" 
        style={isOpen ? { display: "block"} : { display: "none" }}
      >
        <span >
        {t(answer) + t(subAnswer)}
        </span>
      </div>
      {!lastIndex ? <div className="cs-box-border"/> : null}
        </div>
  );
};

export default FaqComponent;