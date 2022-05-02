import React, { useState } from "react";
import { ArrowForward } from "@egovernments/digit-ui-react-components";

const FaqComponent = props => {
  const { question, answer } = props;
  const [isOpen, toggleOpen] = useState(false);

  return (
    <div className="faqs" onClick={() => toggleOpen(!isOpen)}>
          <div className="faq-question" style={{justifyContent: "space-between", display: "flex"}}>
        <span>
          {question}
        </span>
        <span className={isOpen ? "faqicon rotate" : "faqicon"} style={{float: "right"}}>
            {isOpen ? <ArrowForward /> : <ArrowForward/>}
        </span>
      </div>

      <div 
        className="faq-answer" 
        style={isOpen ? { display: "block"} : { display: "none" }}
      >
        <span>
          {answer}
        </span>
      </div>
        </div>
  );
};

export default FaqComponent;