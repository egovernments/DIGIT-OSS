from CityExtract import *
from flask import Flask, jsonify, request, send_file

CityApi = Flask(__name__)

@CityApi.route('/', methods=['POST'])
def reply():
    request_data=request.get_json()
    inp= request_data['input_city']
    lang=request_data['input_lang']

    k= find_city(inp)
    response=dict()
    response['city_detected']= k[0]
    response['match']= k[1]

    return jsonify(response)

CityApi.run()


