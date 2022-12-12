import React from "react"
// import Card from "../atoms/Card"
import {Card} from "react-bootstrap"
import SubmitBar from "../atoms/SubmitBar"

const PageBasedInput = ({children, texts, onSubmit}) => {
    return <div className="PageBasedInputWrapper">
        <Card style={{marginLeft:"18%", maxWidth:"60%" , minWidth:"59%" ,  border: "5px solid #1266af" }}>
            {children}
            <SubmitBar className="SubmitBarInCardInDesktopView" label={texts.submitBarLabel} onSubmit={onSubmit} />
        </Card>
        <div className="SubmitBar">
            <SubmitBar label={texts.submitBarLabel} onSubmit={onSubmit} />
        </div>
    </div>
}

export default PageBasedInput