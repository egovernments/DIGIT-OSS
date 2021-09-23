import React from 'react';
import './App.css';
import Inbox from './components/Inbox';

function App() {


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
    userObject.auth = "15966eb0-92b3-4c16-b304-70470270958b";
    localStorage.setItem("Employee.token", userObject.auth);

    return (

        <div >
            <Inbox user={userObject} t={(key) => { console.log(key); return key }} historyClick={(e) => console.log("history", e)} historyComp={<span>HH</span>} esclatedComp={<span>I</span>}></Inbox>
        </div>
    );
}

export default App;
