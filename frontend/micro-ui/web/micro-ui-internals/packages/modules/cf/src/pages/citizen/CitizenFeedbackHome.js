import React, { Fragment, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardHeader, ComplaintIcon, AvailableOptionsList, UserInput, ChatBubble, MultipleSelect, StarRating, ReplyComponent } from "@egovernments/digit-ui-react-components";
import { landingPageSteps, stepTwo, lastStep, stepThree, stepFour, feedbackStep, ratingStep, WEBSOCKET_URL } from "./config";

const CitizenFeedbackHome = ({ parentRoute }) => {
  const [steps, setSteps] = useState([]);
  const [showFaq, setShowFaq] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeout, setNewTimeout] = useState(250)
  const [initialConnectionOpen, setConnectionOpen] = useState(false)
  const [stepsData, setStepsData, clearStepsData] = Digit.Hooks.useSessionStorage("CF_STEPS", false);
  const history = useHistory();
  const messagesEndRef = useRef(null);
  const User = Digit.UserService.getUser();
  console.log("sdcsdcscs user", User)

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
    console.log('sdcsdcscs98', itemDetails);
    console.log('sdcsdcscs99', itemDetails.key);
    ws.current.send(JSON.stringify(

      {
        "message": {
          "type": "text",
          "input": itemDetails.key
        },
        "user": {
          "mobileNumber": "7391904467"
        },
        "extraInfo": {
          "whatsAppBusinessNumber": "917834811114",
          "filestoreId": ""
        }
      }
    ));
    // if (message === "Raise a complaint") {
    //   stepTwo.stepId = currentStep + 2
    //   updatedSteps.push(stepTwo);
    // }
    // if (message === "Not Recieving OTP") {
    //   stepFour.stepId = currentStep + 2
    //   updatedSteps.push(stepFour);
    // }
    // if (message === "Bill amount is incorrect") {
    //   stepThree.stepId = currentStep + 2
    //   updatedSteps.push(stepThree);
    // }
    // if (message === 'Provide Feedback') {
    //   feedbackStep.stepId = currentStep + 2
    //   updatedSteps.push(feedbackStep)
    // }
    // if (message === 'Rate the service') {
    //   ratingStep.stepId = currentStep + 2
    //   updatedSteps.push(ratingStep)
    // }
    // if (stepDetails.optionType === 'textField' || stepDetails.optionType === 'multiSelect') {
    //   lastStep.stepId = currentStep + 2
    //   updatedSteps.push(lastStep)
    // }
    // if (stepDetails.optionType === 'stars') {
    //   stepThree.stepId = currentStep + 2
    //   updatedSteps.push(stepThree)
    // }
    // if (message === 'Yes, Raise the complaint') {
    //   history.push('/digit-ui/citizen/cf/response')
    // }
    // Digit.SessionStorage.set("CF_STEPS", updatedSteps);
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
    switch (data.optionType) {
      case "button":
        return <AvailableOptionsList stepDetails={data} data={data.option} onItemSelect={data.isDisabled ? onDisableSelect : onItemSelect} />
      case "textbox":
      case "textarea":
        return <UserInput stepDetails={data} data={data.option} handleSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      case 'multiSelect':
        return <MultipleSelect stepDetails={data} data={data.option} handleSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      case 'stars':
        return <StarRating stepDetails={data} data={data.option} onRatingSubmit={data.isDisabled ? onDisableSelect : onItemSelect} />
      default:
        return <AvailableOptionsList stepDetails={data} data={data.option} onItemSelect={data.isDisabled ? onDisableSelect : onItemSelect} />
    }
  }
  console.log("sdcsdcscs345", steps)
  const ws = useRef();

  const connectWebsocket = () => {
    let connectInterval;
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('sdcsdcscs Connection opened!');
      setConnectionOpen(true);
      setNewTimeout(250) // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
      console.log("sdcsdcscs00")
      ws.current.send(JSON.stringify(
        {
          "message": {
            "type": "text",
            "input": "1"
          },
          "user": {
            "mobileNumber": "7391904467"
          },
          "extraInfo": {
            "whatsAppBusinessNumber": "917834811114",
            "filestoreId": ""
          }
        }
      ));
      console.log("sdcsdcscs01")
    };

    ws.current.onmessage = (ev) => {
      console.log("sdcsdcscs1", ev)
      console.log("sdcsdcscs2", ev.data)
      const message = JSON.parse(ev.data);
      console.log("sdcsdcscs22", steps)
      if (typeof message == "object") {
        // Digit.SessionStorage.set("CF_STEPS", [...steps, message]);
        setSteps(steps => [...steps, message]);
      } else {
        const newMessage = { "message": message, "step": "intermediate", "optionType": "text", "option": [] }
        // Digit.SessionStorage.set("CF_STEPS", [...steps, newMessage]);
        setSteps(steps => [...steps, newMessage]);
      }
    };

    ws.current.onclose = (ev) => {
      console.log("sdcsdcscs3", ev)
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
    console.log("sdcsdcscs5", initialConnectionOpen)
    if (initialConnectionOpen && (!ws || ws.current.readyState == WebSocket.CLOSED)) { connectWebsocket(); } //check if websocket instance is closed, if so call `connect` function.
  };

  useEffect(() => {
    // const prevSteps = Digit.SessionStorage.get("CF_STEPS");
    // console.log("sdcsdcscs storage", prevSteps)
    // if (prevSteps && prevSteps.length) {
    //   const initialStep = prevSteps
    //   setSteps(initialStep);
    //   setShowFaq(false)
    // } else {
    //   const initialStep = landingPageSteps
    //   initialStep.stepId = 0
    //   Digit.SessionStorage.set("CF_STEPS", [initialStep]);
    //   setSteps([initialStep]);
    // }

    // return () => {
    //   clearStepsData()
    // }

    connectWebsocket()

    return () => {
      console.log('sdcsdcscs Cleaning up! 🧼');
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
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
