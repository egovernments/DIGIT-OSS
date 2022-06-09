import React, { useState } from "react";
import { ArrowForward } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const FAQComponent = props => {
  const { question, answer, index } = props;
  const [isOpen, toggleOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="faqs" onClick={() => toggleOpen(!isOpen)}>
          <div className="faq-question" style={{justifyContent: "space-between", display: "flex"}}>
        <span>
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
        <span>
        {"•"+t(obj.ans)}
        </span>)}
      </div>
        </div>
  );
};

export default FAQComponent;