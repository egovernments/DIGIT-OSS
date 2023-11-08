import React from 'react';
import Header from './Header';
import Faqs from "../Faqs";
import Footer from "../Footer";
import Stepper from './Stepper';

function TradeLicensePage(){

    const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

    return(
    <div>
        <Header/>
        <h1>Apply for a new Trade License</h1>
        <Stepper steps = {steps} initialStep = {0} />
        <Faqs/>
        <Footer/>
    </div>
    );
}

export default TradeLicensePage;    