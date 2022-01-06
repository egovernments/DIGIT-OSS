import React, { Fragment, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardHeader, ComplaintIcon, AvailableOptionsList, UserInput, ChatBubble, MultipleSelect, StarRating, ReplyComponent, Accordion, PopUp, SubmitBar, RatingPopupImage, CloseSvg, Close } from "@egovernments/digit-ui-react-components";
import { accordionData, PLAYSTORE_URL, WEBSOCKET_URL } from "./config";

const CitizenFeedbackHome = ({ parentRoute }) => {
  const [steps, setSteps] = useState([]);
  const [showFaq, setShowFaq] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeout, setNewTimeout] = useState(250)
  const [initialConnectionOpen, setConnectionOpen] = useState(false)
  const [isLastStep, setIsLastStep] = useState(false)
  const [popup, setPopup] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState(false);
  const [stepsData, setStepsData, clearStepsData] = Digit.Hooks.useSessionStorage("CF_STEPS", false);
  const [successData, setSuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("CF_RESPONSE", false);
  const history = useHistory();
  const messagesEndRef = useRef(null);
  const User = Digit.UserService.getUser();

  const onItemSelect = (stepDetails, itemDetails) => {
    if (showFaq) {
      setShowFaq(false);
    }
    let updatedSteps = steps
    updatedSteps.map((data) => {
      data.isDisabled = true
      if ((stepDetails.optionType === "textbox" || stepDetails.optionType === "textarea" || stepDetails.optionType === "multiSelect") && data.message === stepDetails.message) {
        data.option = []
      }
    })

    let message = itemDetails.value ? itemDetails.value : ""
    updatedSteps.push({
      message: message,
      messageType: "reply",
      step: "intermediate",
      optionType: stepDetails.optionType,
      stepId: currentStep + 1,
      option: itemDetails.length ? itemDetails : [itemDetails],
    });
    if (stepDetails.optionType === "stars" && parseInt(itemDetails.key) >= 4) setFeedbackPopup(true)
    let input = ''
    if (itemDetails.length) {
      let temp = []
      itemDetails.map((data) => {
        temp.push(data.key)
      })
      input = temp
    } else input = itemDetails.key
    let comments = ''
    let applicationId = ''
    let mobileNumber = ''
    if (itemDetails.itemName && itemDetails.itemName === 'mobile number') {
      mobileNumber = itemDetails.key
      input = '1'
    } else if (itemDetails.itemName && itemDetails.itemName === 'Application ID') {
      applicationId = itemDetails.key
      input = '1'
    } else if (itemDetails.itemName && itemDetails.itemName === 'textArea') {
      comments = itemDetails.key
      input = '1'
    }
    const request = {
      "message": {
        "type": "text",
        "input": input
      },
      "user": {
        "mobileNumber": User.info.mobileNumber
      },
      "extraInfo": {
        "whatsAppBusinessNumber": "917834811114",
        "filestoreId": itemDetails.fileStoreId ? itemDetails.fileStoreId : '',
        "comments": comments,
        "applicationId": applicationId,
        "mobileNumber": mobileNumber
      }
    }
    ws.current.send(JSON.stringify(request));
    setStepsData(updatedSteps);
    setCurrentStep(currentStep + 2)
    setSteps([...updatedSteps]);
  };

  const onDisableSelect = () => {
    console.log("Disabled btn selected")
  }

  const handlePopupOpen = (stepDetails, itemDetails) => {
    if (feedbackPopup && isLastStep) {
      setPopup({ stepDetails: stepDetails, itemDetails: itemDetails })
    } else {
      onItemSelect(stepDetails, itemDetails)
    }
  }

  const handlePopupClose = (redirect) => {
    setPopup(false)
    if (redirect) {
      window.open(PLAYSTORE_URL);
    }
    onItemSelect(popup.stepDetails, popup.itemDetails)
  }

  const ws = useRef();

  const connectWebsocket = () => {
    let connectInterval;
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      setConnectionOpen(true);
      setNewTimeout(250) // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
      if (stepsData.length) { } else {
        ws.current.send(JSON.stringify(
          {
            "message": {
              "type": "text",
              "input": "1"
            },
            "user": {
              "mobileNumber": User.info.mobileNumber
            },
            "extraInfo": {
              "whatsAppBusinessNumber": "917834811114",
              "filestoreId": ""
            }
          }
        ));
      }
    };

    ws.current.onclose = (ev) => {
      if (ev.code === 4000) {
        // navigate('/kicked', { state: { kickReason: ev.reason } });
      }
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (timeout + timeout) / 1000
        )} second.`,
        ev.reason
      );

      let updatedTimeout = timeout + timeout; //increment retry interval
      setNewTimeout(updatedTimeout)
      connectInterval = setTimeout(check, Math.min(10000, updatedTimeout)); //call check function after timeout
    };

    ws.current.onerror = err => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.current.close();
    };
  }

  const check = () => {
    if (initialConnectionOpen && (!ws || ws.current.readyState == WebSocket.CLOSED)) { connectWebsocket(); } //check if websocket instance is closed, if so call `connect` function.
  };

  useEffect(() => {
    const prevSteps = stepsData;
    if (prevSteps && prevSteps.length) {
      const initialStep = prevSteps
      setSteps(initialStep);
      setShowFaq(false)
    } else {
    }

    connectWebsocket()

    return () => {
      ws.current.close();
      clearStepsData()
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    ws.current.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      if (typeof message == "object") {
        setStepsData([...steps, message]);
        setSteps(steps => [...steps, message]);
      } else {
        if (isLastStep) {
          setSuccessData(ev.data)
          history.push(`/digit-ui/citizen/cf/response`);
        }
        const newMessage = { "message": message, "step": "intermediate", "optionType": "text", "option": [] }
        setStepsData([...steps, newMessage]);
        setSteps(steps => [...steps, newMessage]);
      }
      if (message.step === 'last') {
        setIsLastStep(true)
      }
    };
  });

  const renderMessage = (step) => {
    return step.map((data) => {
      switch (data.messageType) {
        case 'reply':
          return <ReplyComponent stepDetails={data} type="right" />
        default:
          return <>
            {data.message && <ChatBubble type="left" >
              {data.message}
            </ChatBubble>}
            {renderItems(data)}
          </>
      }
    })
  }

  const renderItems = (data) => {
    switch (data.optionType) {
      case "button":
        return <AvailableOptionsList stepDetails={data} data={data.option} onItemSelect={data.isDisabled ? onDisableSelect : onItemSelect} />
      case "textbox":
      case "textarea":
        return <UserInput stepDetails={data} data={data.option} handleSubmit={data.isDisabled ? onDisableSelect : handlePopupOpen} />
      case 'multiSelect':
        return <MultipleSelect stepDetails={data} data={data.option} handleSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      case 'stars':
        return <StarRating stepDetails={data} data={data.option} onRatingSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      default:
        return <AvailableOptionsList stepDetails={data} data={data.option} onItemSelect={data.isDisabled ? onDisableSelect : onItemSelect} />
    }
  }

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

          <div className="accordion">
            {accordionData.map(({ title, children }) => (
              <Accordion title={title} children={children} />
            ))}
          </div>
        </Card>
      )}
      {popup && (
        <PopUp className="cfPopup">
          <div className="popup-module cfPopupCard">
            <div className="cfPopupClose" onClick={() => handlePopupClose(false)} ><CloseSvg /></div>
            <p className="cfPopupText">Would you also like to rate us on Playstore / Appstore?</p>
            <div className="cfPopupImage"><RatingPopupImage style={{ display: 'inline-block' }} /></div>
            <div className="cfPopupButtonDiv">
              <div className="cfPopupTextButton" onClick={() => handlePopupClose(false)}>Not Now</div>
              <div className="cfPopupButton" onClick={() => handlePopupClose(true)}><SubmitBar label={"Yes"} /></div>
            </div>
          </div>
        </PopUp>
      )}
    </>
  );
};

export default CitizenFeedbackHome;
