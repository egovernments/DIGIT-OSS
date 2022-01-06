import React from "react";
import Rating from "../atoms/Rating";
import ChatBubble from "../atoms/ChatBubble";

const ReplyComponent = (props) => {

    const renderChild = (type, message) => {
        switch (type) {
            case 'singleSelect':
            case 'textField':
                return message
            case 'stars':
                return <Rating styles={{ width: "100%", margin: "0px", display: "inline-flex" }} currentRating={props.stepDetails.message} maxRating={5} />
            default:
                return message
        }
    }

    return (
        props.stepDetails.option.map((data) => (
            <ChatBubble type="right" >
                {renderChild(props.stepDetails.optionType, data.value)}
            </ChatBubble>
        ))
    );
};

export default ReplyComponent