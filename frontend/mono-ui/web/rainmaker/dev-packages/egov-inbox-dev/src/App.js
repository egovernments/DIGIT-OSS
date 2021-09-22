import React, { useEffect, useState } from 'react';
import './App.css';
import Inbox from './components/Inbox';
import { fetchLocalisation } from './components/utils';

function App() {
const [localisationData, setData] = useState(JSON.parse(localStorage.getItem("inbox-localisationData"))||{})

    let userObject = {
        "id": 12012,
        "uuid": "3eba8064-d37d-4dc9-9991-96859d30beaf",
        "userName": "QAPTCE",
        "name": "Prakash",
        "mobileNumber": "9999999991",
        "emailId": null,
        "locale": null,
        "type": "EMPLOYEE",
        "roles": [
            {
                "name": "PT Counter Employee",
                "code": "PT_CEMP",
                "tenantId": "pb.amritsar"
            }
        ],
        "active": true,
        "tenantId": "pb.amritsar",
        "permanentCity": 'pb'
    }
    userObject.auth = "0dc013c4-5397-4102-91a5-cabe8ebdbaba";
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
