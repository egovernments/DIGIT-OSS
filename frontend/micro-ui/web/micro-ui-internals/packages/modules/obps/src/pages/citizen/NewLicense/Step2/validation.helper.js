export const getMinimumNorms = (typeOfColony,potential) => {
    if(typeOfColony === "Residential Plotted Colony" && potential === "Hyper"){
        return 25;
    } else if(typeOfColony === "Residential Plotted Colony" && potential === "High"){
        return 20;
    } else if(typeOfColony === "Residential Plotted Colony" && potential === "Medium"){
        return 15;
    } else if(typeOfColony === "Residential Plotted Colony" && potential === "Low"){
        return 10;
    } else if(typeOfColony === "Residential Group Housing" && potential === "Hyper"){
        return 5;
    } else if(typeOfColony === "Residential Group Housing" && potential === "High"){
        return 4;
    } else if(typeOfColony === "Residential Group Housing" && potential === "Medium"){
        return 2;
    } else if(typeOfColony === "Residential Group Housing" && potential === "Low"){
        return 1;
    } else if(typeOfColony === "New Integrated Licencing Policy (NILP) for Commercial" && potential === "Hyper"){
        return 10;
    } else if(typeOfColony === "New Integrated Licencing Policy (NILP) for Commercial" && potential === "High"){
        return 10;
    } else if(typeOfColony === "New Integrated Licencing Policy (NILP) for Commercial" && potential === "Medium"){
        return 5;
    } else if(typeOfColony === "New Integrated Licencing Policy (NILP) for Commercial" && potential === "Low"){
        return 5;
    } else if(typeOfColony ==="New Integrated Licencing Policy (NILP) for Residential Use" && potential === "Hyper"){
        return 10;
    } else if(typeOfColony === "New Integrated Licencing Policy (NILP) for Residential Use" && potential === "High"){
        return 10;
    } else if(typeOfColony === "New Integrated Licencing Policy (NILP) for Residential Use" && potential === "Medium"){
        return 5;
    } else if(typeOfColony === "New Integrated Licencing Policy (NILP) for Residential Use" && potential === "Low"){
        return 5;
    } else if(typeOfColony ==="Affordable residential plotted under DDJAY policy" && potential === "Hyper"){
        return 5;
    } else if(typeOfColony === "Affordable residential plotted under DDJAY policy" && potential === "High"){
        return 5;
    } else if(typeOfColony === "Affordable residential plotted under DDJAY policy" && potential === "Medium"){
        return 5;
    } else if(typeOfColony === "Affordable residential plotted under DDJAY policy" && potential === "Low"){
        return 5;
    } else if(typeOfColony ==="Affordable Group Housing (AGH)" && potential === "Hyper"){
        return 4;
    } else if(typeOfColony === "Affordable Group Housing (AGH)" && potential === "High"){
        return 4;
    } else if(typeOfColony === "Affordable Group Housing (AGH)" && potential === "Medium"){
        return 4;
    } else if(typeOfColony === "Affordable Group Housing (AGH)" && potential === "Low"){
        return 4;
    } else if(typeOfColony ==="AGH Colony (falling within Municipal Limits" && potential === "Hyper"){
        return 1;
    } else if(typeOfColony === "AGH Colony (falling within Municipal Limits" && potential === "High"){
        return 1;
    } else if(typeOfColony === "AGH Colony (falling within Municipal Limits" && potential === "Medium"){
        return 1;
    } else if(typeOfColony === "AGH Colony (falling within Municipal Limits" && potential === "Low"){
        return 1;
    } else if((typeOfColony ==="Transit Oriented Development (TOD)-IT" || typeOfColony ==="Transit Oriented Development  (TOD)" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Commercial" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing") && potential === "Hyper"){
        return 4;
    } else if((typeOfColony ==="Transit Oriented Development (TOD)-IT" || typeOfColony ==="Transit Oriented Development  (TOD)" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Commercial" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing") && potential === "High"){
        return 4;
    } else if((typeOfColony ==="Transit Oriented Development (TOD)-IT" || typeOfColony ==="Transit Oriented Development  (TOD)" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Commercial" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing") && potential === "Medium"){
        return 2;
    } else if((typeOfColony ==="Transit Oriented Development (TOD)-IT" || typeOfColony ==="Transit Oriented Development  (TOD)" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Commercial" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing" ||  typeOfColony ==="Transit Oriented Development (TOD)-Mix Use Development with majority Group Housing") && potential === "Low"){
        return 1;
    } else if(typeOfColony ==="Commercial Colony in the Residential sector" && potential === "Hyper"){
        return 2;
    } else if(typeOfColony === "Commercial Colony in the Residential sector" && potential === "High"){
        return 2;
    } else if(typeOfColony === "Commercial Colony in the Residential sector" && potential === "Medium"){
        return 1;
    } else if(typeOfColony === "Commercial Colony in the Residential sector" && potential === "Low"){
        return 0.5;
    } else if(typeOfColony ==="Commercial Colony in the Commercial sector" && potential === "Hyper"){
        return 2;
    } else if(typeOfColony === "Commercial Colony in the Commercial sector" && potential === "High"){
        return 2;
    } else if(typeOfColony === "Commercial Colony in the Commercial sector" && potential === "Medium"){
        return 1;
    } else if(typeOfColony === "Commercial Colony in the Commercial sector" && potential === "Low"){
        return 0.5;
    } else if(typeOfColony ==="Low-Density Eco-Friendly Colony" && potential === "Hyper"){
        return 25;
    } else if(typeOfColony === "Low-Density Eco-Friendly Colony" && potential === "High"){
        return 25;
    } else if(typeOfColony === "Low-Density Eco-Friendly Colony" && potential === "Medium"){
        return 15;
    } else if(typeOfColony === "Low-Density Eco-Friendly Colony" && potential === "Low"){
        return 10;
    } else if(typeOfColony ==="Industrial Plotted" && potential === "Hyper"){
        return 25;
    } else if(typeOfColony === "Industrial Plotted" && potential === "High"){
        return 20;
    } else if(typeOfColony === "Industrial Plotted" && potential === "Medium"){
        return 15;
    } else if(typeOfColony === "Industrial Plotted" && potential === "Low"){
        return 10;
    } else if(typeOfColony ==="Integrated Industrial Licensing" && potential === "Hyper"){
        return 25;
    } else if(typeOfColony === "Integrated Industrial Licensing" && potential === "High"){
        return 20;
    } else if(typeOfColony === "Integrated Industrial Licensing" && potential === "Medium"){
        return 15;
    } else if(typeOfColony === "Integrated Industrial Licensing" && potential === "Low"){
        return 10;
    } else if(typeOfColony ==="IT/Cyber City" && potential === "Hyper"){
        return 50;
    } else if(typeOfColony === "IT/Cyber City" && potential === "High"){
        return 50;
    } else if(typeOfColony === "IT/Cyber City" && potential === "Medium"){
        return 50;
    } else if(typeOfColony === "IT/Cyber City" && potential === "Low"){
        return 50;
    } else if(typeOfColony ==="IT/Cyber Park" && potential === "Hyper"){
        return 5;
    } else if(typeOfColony === "IT/Cyber Park" && potential === "High"){
        return 5;
    } else if(typeOfColony === "IT/Cyber Park" && potential === "Medium"){
        return 5;
    } else if(typeOfColony === "IT/Cyber Park" && potential === "Low"){
        return 5;
    } else if(typeOfColony ==="Retirement Housing" && potential === "Hyper"){
        return 0.5;
    } else if(typeOfColony === "Retirement Housing" && potential === "High"){
        return 0.5;
    } else if(typeOfColony === "Retirement Housing" && potential === "Medium"){
        return 0.5;
    } else if(typeOfColony === "Retirement Housing" && potential === "Low"){
        return 0.5;
    } else {
        return 1;
    }
}



export const getMaxNorms = (typeOfColony,potential) => {
    if(typeOfColony ==="AGH Colony (falling within Municipal Limits" && potential === "Hyper"){
        return 30;
    } else if(typeOfColony === "AGH Colony (falling within Municipal Limits" && potential === "High"){
        return 30;
    } else if(typeOfColony === "AGH Colony (falling within Municipal Limits" && potential === "Medium"){
        return 30;
    } else if(typeOfColony === "AGH Colony (falling within Municipal Limits" && potential === "Low"){
        return 30;
    } else if(typeOfColony ==="Commercial Colony in the Residential sector" && potential === "Hyper"){
        return 4;
    } else if(typeOfColony === "Commercial Colony in the Residential sector" && potential === "High"){
        return 4;
    } else if(typeOfColony === "Commercial Colony in the Residential sector" && potential === "Medium"){
        return 4;
    } else if(typeOfColony === "Commercial Colony in the Residential sector" && potential === "Low"){
        return 4;
    } else {
        return 100000000000000;
    }
}