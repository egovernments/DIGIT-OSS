import React, { Fragment, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardHeader, ComplaintIcon } from "@egovernments/digit-ui-react-components";
import AvailableOptionsList from "../../molecules/AvailableOptionsList";
import UserInput from "../../molecules/UserInput";
import { landingPageSteps, stepTwo, lastStep, stepThree, stepFour, feedbackStep, ratingStep } from "./config";
import { ChatBubble } from "../../atoms/ChatBubble";
import MultipleSelect from "../../molecules/MultipleSelect";
import StarRating from "../../atoms/StarRating";
import { ReplyComponent } from "../../molecules/ReplyComponent";

const CitizenFeedbackHome = ({ parentRoute }) => {
  const [steps, setSteps] = useState([]);
  const [showFaq, setShowFaq] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();
  const messagesEndRef = useRef(null);

  const onItemSelect = (stepDetails, itemDetails) => {
    if (showFaq) {
      setShowFaq(false);
    }
    let updatedSteps = steps
    updatedSteps.map((data) => {
      data.isDisabled = true
      if ((stepDetails.type === "textField" || stepDetails.type === "multiSelect") && data.message === stepDetails.message) {
        data.option = []
      }
    })

    let message = itemDetails.value ? itemDetails.value : ""
    updatedSteps.push({
      message: message,
      messageType: "reply",
      step: "intermediate",
      type: stepDetails.type,
      stepId: currentStep + 1,
      option: itemDetails.length ? itemDetails : [itemDetails],
    });
    if (message === "Raise a complaint") {
      stepTwo.stepId = currentStep + 2
      updatedSteps.push(stepTwo);
    }
    if (message === "Not Recieving OTP") {
      stepFour.stepId = currentStep + 2
      updatedSteps.push(stepFour);
    }
    if (message === "Bill amount is incorrect") {
      stepThree.stepId = currentStep + 2
      updatedSteps.push(stepThree);
    }
    if (message === 'Provide Feedback') {
      feedbackStep.stepId = currentStep + 2
      updatedSteps.push(feedbackStep)
    }
    if (message === 'Rate the service') {
      ratingStep.stepId = currentStep + 2
      updatedSteps.push(ratingStep)
    }
    if (stepDetails.type === 'textField' || stepDetails.type === 'multiSelect') {
      lastStep.stepId = currentStep + 2
      updatedSteps.push(lastStep)
    }
    if (stepDetails.type === 'stars') {
      stepThree.stepId = currentStep + 2
      updatedSteps.push(stepThree)
    }
    if (message === 'Yes, Raise the complaint') {
      history.push('/digit-ui/citizen/cf/response')
    }
    setCurrentStep(currentStep + 2)
    setSteps([...updatedSteps]);
  };

  const onDisableSelect = () => {
    console.log("Disabled btn selected")
  }

  const renderMessage = (step) => {
    return step.map((data) => {
      switch (data.messageType) {
        case 'reply':
          return <ReplyComponent stepDetails={data} type="right" />
        default:
          return <>
            <ChatBubble type="left" >
              {data.message}
            </ChatBubble>
            {renderItems(data)}
          </>
      }
    })
  }

  const renderItems = (data) => {
    switch (data.type) {
      case 'singleSelect':
        return <AvailableOptionsList stepDetails={data} data={data.option} onItemSelect={data.isDisabled ? onDisableSelect : onItemSelect} />
      case 'textField':
        return <UserInput stepDetails={data} data={data.option} handleSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      case 'multiSelect':
        return <MultipleSelect stepDetails={data} data={data.option} handleSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      case 'stars':
        return <StarRating stepDetails={data} data={data.option} onRatingSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      default:
        return <AvailableOptionsList stepDetails={data} data={data.option} onItemSelect={data.isDisabled ? onDisableSelect : onItemSelect} />
    }
  }

  useEffect(() => {
    const initialStep = landingPageSteps
    initialStep.stepId = 0
    setSteps([initialStep]);
  }, []);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <>
      <Card style={{ paddingRight: "0" }}>
        <div className="CardHeaderFeedback" style={{ display: "flex", marginBottom: "30px", marginTop: "10px" }}>
          <ComplaintIcon />
          <CardHeader >
            <div style={{
              marginLeft: "10px",
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "bold",
              lineHeight: "40px",
              textAlign: "center",
              color: "#505A5F"
            }}>Feedback Bot</div>
          </CardHeader>
        </div>
        <ChatBubble type="left" >
          Hi
        </ChatBubble>
        {renderMessage(steps)}
        <div ref={messagesEndRef} />
      </Card>
      {showFaq && (
        <Card>
          <p style={{ color: '#F47738', fontSize: '20px' }}>FAQs</p>
        </Card>
      )}
    </>
  );
};

export default CitizenFeedbackHome;
