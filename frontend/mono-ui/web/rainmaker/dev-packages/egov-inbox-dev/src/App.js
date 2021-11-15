import React, { useEffect, useState } from 'react';
import './App.css';
import Inbox from './components/Inbox';
import { fetchLocalisation } from './components/utils';

function App() {
    const [localisationData, setData] = useState(JSON.parse(localStorage.getItem("inbox-localisationData")) || {})

    let userObject ={
        "id": 32563,
        "uuid": "8d1dfdc5-13e8-4800-89f9-de284089da9c",
        "userName": "QASV",
        "name": "Supervisor",
        "mobileNumber": "7899898989",
        "emailId": null,
        "locale": null,
        "type": "EMPLOYEE",
        "roles": [
            {
                "name": "TL Counter Employee",
                "code": "TL_CEMP",
                "tenantId": "pb.amritsar"
            },
            {
                "name": "Auto Escalation Supervisor",
                "code": "SUPERVISOR",
                "tenantId": "pb.amritsar"
            },
            {
                "name": "Auto Escalation Employee",
                "code": "AUTO_ESCALATE",
                "tenantId": "pb.amritsar"
            }
        ],
        "active": true,
        "tenantId": "pb.amritsar",
        "permanentCity": "pb"
    };
    userObject.auth = "73ff17e9-1b47-4207-a91c-bf09c951b72b";
    localStorage.setItem("Employee.token", userObject.auth);

    useEffect(() => {
        localisationData && Object.keys(localisationData).length == 0 && fetchLocalisation();
        return () => {
        }
    }, [])

    return (

        <div >
            <Inbox user={userObject} t={(key) => localisationData && localisationData[key] ? localisationData[key] : key} historyClick={(e) => console.log("history", e)} historyComp={<span>HH</span>} esclatedComp={<span>I</span>}></Inbox>
        </div>
    );
}

export default App;
