from CitySearch import *
from LocalitySearch import *
from flask import Flask, jsonify, request, send_file

controller = Flask(__name__)

@controller.route('/nlp-engine/fuzzy/city', methods=['POST'])
def getCities():
    request_data = request.get_json()
    inp  = request_data['input_city']
    lang = request_data['input_lang']

    predictCityData = findCity(inp)
    response = dict()
    response['city_detected'] = predictCityData[0]
    response['match'] = predictCityData[1]

    return jsonify(response)

@controller.route('/nlp-engine/fuzzy/locality',methods=['POST'])
def getLocalities():
    request_data = request.get_json()
    city = request_data['city']
    locality = request_data['locality']

    predictLocalityData = findLocality(city, locality)
    return predictLocalityData


    
controller.run(host='0.0.0.0',port=8080)
