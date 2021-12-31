export const WEBSOCKET_URL = globalConfigs?.getConfig("xstate-webchat-services") || 'ws://dev.digit.org/xstate-webchat';

export const landingPageSteps = {
    "message": "Please select what you need help with?",
    "step": "intermediate",
    "optionType": "singleSelect",
    "option": [
        {
            "key": "1",
            "value": "Raise a complaint123",
            "type": "button"
        },
        {
            "key": "2",
            "value": "Provide Feedback",
            "type": "button"
        },
        {
            "key": "3",
            "value": "Rate the service",
            "type": "button"
        }
    ]
}

export const stepTwo = {
    "message": "What is your complaint about?",
    "step": "intermediate",
    "optionType": "singleSelect",
    "option": [
        {
            "key": "1",
            "value": "Not Recieving OTP",
            "type": "button"
        },
        {
            "key": "2",
            "value": "Unable to Proceed Forward",
            "type": "button"
        },
        {
            "key": "3",
            "value": "Bill amount is incorrect",
            "type": "button"
        }
    ]
}

export const stepThree = {
    "message": "We would need more details",
    "step": "intermediate",
    "optionType": "multiSelect",
    "option": [
        {
            "key": "1",
            "value": "Bill Amount is Too High",
            "type": "button"
        },
        {
            "key": "2",
            "value": "Bill Amount is Negative",
            "type": "button"
        },
        {
            "key": "3",
            "value": "Mistakenly paid for someone else",
            "type": "button"
        }
    ]
}

export const stepFour = {
    "message": "Please enter your Phone Number",
    "step": "last",
    "optionType": "textarea",
    "option": [
        {
            "key": "1",
            "value": "Mobile Number on Which OTP is not recieved",
            "type": "button"
        }
    ]
}

export const lastStep = {
    "message": "Do you want to raise the complaint",
    "step": "last",
    "optionType": "singleSelect",
    "option": [
        {
            "key": "1",
            "value": "Yes, Raise the complaint",
            "type": "button"
        },
        {
            "key": "2",
            "value": "Back to editing",
            "type": "button"
        }
    ]
}

export const feedbackStep = {
    "message": "Let us know your feedback",
    "step": "last",
    "optionType": "textarea",
    "option": [
        {
            "key": "1",
            "value": "Share your experience with us",
            "type": "button"
        }
    ]
}

export const ratingStep = {
    "message": "How would you rate your experience with us?",
    "step": "last",
    "optionType": "stars",
    "option": [
        {
            "key": "1",
            "value": "Share your experience with us",
            "type": "button"
        }
    ]
}