import React, { useEffect, useState } from 'react';
import './App.css';
import Inbox from './components/Inbox';
import { fetchLocalisation } from './components/utils';

function App() {
const [localisationData, setData] = useState(JSON.parse(localStorage.getItem("inbox-localisationData"))||{})

    let userObject ={
        "id": 32296,
        "uuid": "3f2729f7-a6cf-4ff6-97e9-6796586e67fc",
        "userName": "LME_D1",
        "name": "Street light LME",
        "mobileNumber": "9879878979",
        "emailId": null,
        "locale": null,
        "type": "EMPLOYEE",
        "roles": [
            {
                "name": "PGR Last Mile Employee",
                "code": "PGR_LME",
                "tenantId": "pb.amritsar"
            },
            {
                "name": "TL Field Inspector",
                "code": "TL_FIELD_INSPECTOR",
                "tenantId": "pb.amritsar"
            },
            {
                "name": "Employee",
                "code": "EMPLOYEE",
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
    userObject.auth = "846bc255-2d42-4ddd-8fb3-a6448c4b3afa";
    localStorage.setItem("Employee.token", userObject.auth);

    useEffect(() => {
        localisationData&&Object.keys(localisationData).length==0&&fetchLocalisation();
        return () => {
        }
    }, [])

    return (

        <div >
            <Inbox user={userObject} t={(key) => localisationData&&localisationData[key]?localisationData[key]:key  } historyClick={(e) => console.log("history", e)} historyComp={<span>HH</span>} esclatedComp={<span>I</span>}></Inbox>
        </div>
    );
}

export default App;
