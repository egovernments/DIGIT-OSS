const fetch = require("node-fetch");
const config = require('../../../env-variables');

// Input latlng is a string containing pair of numbers separated by , and without but surrounding braces
async function getCityAndLocality(latlng) {
    let apiKey = config.googleAPIKey;
    var reverseGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${apiKey}`;

    let response = await fetch(reverseGeocodeURL);
    let responseJson = await response.json();

    if(responseJson.status === 'OK') {
        let city = extractCityFrom(responseJson);
        let locality = extractLocalityFrom(responseJson);
        return {
            city: city,
            locality: locality
        }
    } else {
        return {
            city: null,
            locality: null
        }
    }
}

function extractCityFrom(response) {
    return searchResponseFor('locality', response);
}

function extractLocalityFrom(response) {
    var locality = searchResponseFor('sublocality_level_2', response);
    if(locality === null) {
        locality = searchResponseFor('sublocality_level_1', response);
    }
    return locality;
}

function searchResponseFor(key, response) {
    let results = response.results;
    for(var i = 0; i < results.length; i++) {
        let address_components = results[i].address_components;
        for(var j = 0; j < address_components.length; j++) {
            let types = address_components[j].types;
            if(types.includes(key)) {
                return address_components[j].long_name;
            }
        }
    }
    return null;
}

module.exports = getCityAndLocality;
