export const scrutinyDetailsMockJson = [
    {
      "name": "New Plan Scrutiny",
      "originalRequest": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "name": "Content-Type",
            "value": "multipart/form-data",
            "type": "text"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "edcrRequest",
              "value": {
                "transactionNumber": "136",
                "edcrNumber": "123",
                "planFile": null,
                "tenantId": "state",
                "RequestInfo": {
                  "apiId": "",
                  "ver": "",
                  "ts": "",
                  "action": "",
                  "did": "",
                  "authToken": "92051a7f-4c98-422d-a31c-d726601bafe5",
                  "key": "",
                  "msgId": "",
                  "correlationId": "",
                  "userInfo": {
                    "id": ""
                  }
                }
              },
              "type": "text"
            },
            {
              "key": "planFile",
              "type": "file",
              "src": "/home/vinoth/Downloads/High_Accepted_STAIR_NEW(3).dxf"
            }
          ]
        },
        "url": {
          "raw": "http://local.test.in.state:9880/edcr/rest/dcr/scrutinizeplan?tenantId=state",
          "protocol": "http",
          "host": [
            "local",
            "test",
            "in",
            "state"
          ],
          "port": "9880",
          "path": [
            "edcr",
            "rest",
            "dcr",
            "scrutinizeplan"
          ],
          "query": [
            {
              "key": "tenantId",
              "value": "state"
            }
          ]
        }
      },
      "status": "OK",
      "code": 200,
      "_postman_previewlanguage": "json",
      "header": [
        {
          "key": "Expires",
          "value": "-1"
        },
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "X-Powered-By",
          "value": "Undertow/1"
        },
        {
          "key": "Set-Cookie",
          "value": "SESSIONID=8838c1e8-667d-44df-af68-4cfe8ecf952f; path=/; domain=test.in; HttpOnly"
        },
        {
          "key": "Server",
          "value": "WildFly/11"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Date",
          "value": "Wed, 23 Oct 2019 10:15:48 GMT"
        },
        {
          "key": "Connection",
          "value": "keep-alive"
        },
        {
          "key": "Vary",
          "value": "*"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Transfer-Encoding",
          "value": "chunked"
        },
        {
          "key": "Content-Type",
          "value": "application/json;charset=UTF-8"
        }
      ],
      "cookie": {},
      "body": {
        "responseInfo": {
          "apiId": "",
          "ver": "",
          "ts": null,
          "resMsgId": "",
          "msgId": "",
          "status": "successful"
        },
        "edcrDetail": [
          {
            "dxfFile": "http://local.test.in.state:9880/edcr/rest/dcr/downloadfile/26d6843c-6865-4c17-a6fa-3ff39b67f26c",
            "updatedDxfFile": "http://local.test.in.state:9880/edcr/rest/dcr/downloadfile/d98b1ef7-8518-4a3a-b5b6-f2a2a5c53183",
            "planReport": "http://local.test.in.state:9880/edcr/rest/dcr/downloadfile/0f8b741c-b214-47e5-b5fd-9abc126ce656",
            "transactionNumber": "136",
            "status": "Accepted",
            "edcrNumber": "DCR102019XKAG3",
            "planPdfs": [
              "http://local.test.in.state:9880/edcr/rest/dcr/downloadfile/26d6843c-6865-4c17-a6fa-3ff39b67f26c",
              "http://local.test.in.state:9880/edcr/rest/dcr/downloadfile/0f8b741c-b214-47e5-b5fd-9abc126ce656"
            ],
            "planDetail": {
              "utility": {
                "presentInDxf": false,
                "minimumDistance": 0,
                "minimumSide": 0,
                "length": 0,
                "width": 0,
                "height": 0,
                "mean": 0,
                "area": 0,
                "isValid": null,
                "colorCode": 0,
                "wasteDisposalUnits": [],
                "wasteWaterRecyclePlant": [],
                "liquidWasteTreatementPlant": [],
                "wells": [],
                "wellDistance": [],
                "rainWaterHarvest": [
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999545266,
                    "width": 0.9999999999564086,
                    "height": 0.9999999999995643,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.398201349668787,
                    "width": 1.199999999700878,
                    "height": 2.5000000000004476,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999983054,
                    "width": 0.9999999999990462,
                    "height": 1.0000000000000684,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "solar": [
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.999999999998371,
                    "width": 0,
                    "height": 1.0000000000000684,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999982205,
                    "width": 0,
                    "height": 1.0000000000000588,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "rainWaterHarvestingTankCapacity": null,
                "biometricWasteTreatment": [],
                "solidLiqdWasteTrtmnt": [],
                "solarWaterHeatingSystems": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.398201349668694,
                    "width": 0,
                    "height": 2.500000000000467,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.398201349668787,
                    "width": 0,
                    "height": 2.5000000000004476,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "segregationOfWaste": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.39820134966874,
                    "width": 0,
                    "height": 2.5000000000004476,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999545457,
                    "width": 0,
                    "height": 0.9999999999995643,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "waterTankCapacity": null
              },
              "planInformation": {
                "plotArea": 511,
                "ownerName": null,
                "occupancy": "Residential",
                "serviceType": null,
                "amenities": null,
                "architectInformation": null,
                "acchitectId": null,
                "applicantName": null,
                "crzZoneArea": true,
                "crzZoneDesc": "NA",
                "demolitionArea": 15,
                "depthCutting": null,
                "depthCuttingDesc": "NA",
                "governmentOrAidedSchool": null,
                "securityZone": true,
                "securityZoneDesc": "NA",
                "accessWidth": null,
                "noOfBeds": null,
                "nocToAbutSideDesc": "NA",
                "nocToAbutRearDesc": "NA",
                "openingOnSide": false,
                "openingOnSideBelow2mtsDesc": "NA",
                "openingOnSideAbove2mtsDesc": "NA",
                "openingOnRearBelow2mtsDesc": "NA",
                "openingOnRearAbove2mtsDesc": "NA",
                "openingOnRear": false,
                "parkingToMainBuilding": false,
                "noOfSeats": 0,
                "noOfMechanicalParking": 0,
                "singleFamilyBuilding": null,
                "reSurveyNo": null,
                "revenueWard": null,
                "desam": null,
                "village": null,
                "zoneWise": null,
                "landUseZone": "RESIDENTIAL",
                "leaseHoldLand": "NO",
                "roadWidth": 3,
                "roadLength": 0,
                "typeOfArea": "OLD",
                "depthOfPlot": 9,
                "widthOfPlot": 11,
                "buildingNearMonument": "YES",
                "buildingNearGovtBuilding": "YES",
                "nocNearMonument": "YES",
                "nocNearAirport": "YES",
                "nocNearDefenceAerodomes": "YES",
                "nocStateEnvImpact": "YES",
                "nocRailways": "YES",
                "nocCollectorGvtLand": "YES",
                "nocIrrigationDept": "YES",
                "nocFireDept": "NA",
                "buildingNearToRiver": "YES",
                "barrierFreeAccessForPhyChlngdPpl": "YES",
                "provisionsForGreenBuildingsAndSustainability": "YES",
                "fireProtectionAndFireSafetyRequirements": "NA",
                "plotNo": "82/1 (TP:82/100)",
                "khataNo": "21 (EW:56)",
                "mauza": "MUSHARI",
                "district": "MITHUNPURA",
                "rwhDeclared": "YES"
              },
              "plot": {
                "presentInDxf": true,
                "minimumDistance": 0,
                "minimumSide": 0,
                "length": 0,
                "width": 0,
                "height": 0,
                "mean": 0,
                "area": 511,
                "isValid": null,
                "colorCode": 0,
                "frontYard": null,
                "rearYard": null,
                "sideYard1": null,
                "sideYard2": null,
                "setBacks": [],
                "buildingFootPrint": {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 0,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0
                },
                "bsmtFrontYard": null,
                "bsmtRearYard": null,
                "bsmtSideYard1": null,
                "bsmtSideYard2": null,
                "smallPlot": false,
                "plotBndryArea": 172.1566,
                "levelZeroSetBack": null
              },
              "blocks": [
                {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 3.66,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0,
                  "building": {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 0,
                    "width": 0,
                    "height": 0,
                    "mean": 0,
                    "area": 0,
                    "isValid": null,
                    "colorCode": 0,
                    "buildingHeight": 3.66,
                    "declaredBuildingHeight": 3.66,
                    "heightIncreasedBy": null,
                    "buildingTopMostHeight": null,
                    "totalFloorArea": 57.9095,
                    "totalExistingFloorArea": 0,
                    "exteriorWall": null,
                    "shade": null,
                    "far": null,
                    "coverage": 10.26,
                    "coverageArea": 52.44,
                    "maxFloor": 2,
                    "totalFloors": 2,
                    "floors": [
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "occupancies": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "type": "Residential",
                            "typeHelper": {
                              "type": {
                                "color": null,
                                "code": "A",
                                "name": "Residential"
                              },
                              "subtype": {
                                "color": 25,
                                "code": "A-R",
                                "name": "Residential"
                              },
                              "usage": null,
                              "convertedType": null,
                              "convertedSubtype": null,
                              "convertedUsage": null
                            },
                            "deduction": 0.9655,
                            "builtUpArea": 52.44,
                            "floorArea": 51.4745,
                            "carpetArea": 49.4701,
                            "carpetAreaDeduction": 0,
                            "existingBuiltUpArea": 0,
                            "existingFloorArea": 0,
                            "existingCarpetArea": 0,
                            "existingCarpetAreaDeduction": 0,
                            "existingDeduction": 0,
                            "withAttachedBath": false,
                            "withOutAttachedBath": false,
                            "withDinningSpace": false,
                            "recreationalSpace": [],
                            "mezzanineNumber": null,
                            "isMezzanine": false
                          }
                        ],
                        "convertedOccupancies": [],
                        "units": [],
                        "daRooms": [],
                        "ramps": [],
                        "vehicleRamps": [],
                        "lifts": [],
                        "daLifts": [],
                        "exterior": null,
                        "openSpaces": [],
                        "specialWaterClosets": [],
                        "coverageDeduct": [],
                        "name": null,
                        "number": 0,
                        "exitWidthDoor": [],
                        "exitWidthStair": [],
                        "mezzanineFloor": [],
                        "halls": [],
                        "fireStairs": [],
                        "generalStairs": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "number": "1",
                            "stairMeasurements": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 13.199999999991576,
                                "width": 0,
                                "height": 4.19999999999709,
                                "mean": 0,
                                "area": 9.72,
                                "isValid": null,
                                "colorCode": 256
                              }
                            ],
                            "flights": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              },
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "2",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              }
                            ],
                            "landings": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "landingPolylines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 5.396368562876653,
                                    "width": 0,
                                    "height": 1.5073325937146007,
                                    "mean": 0,
                                    "area": 1.795,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "landingPolyLineClosed": true,
                                "lengths": [
                                  1.1744
                                ],
                                "widths": [
                                  1.5052
                                ]
                              }
                            ]
                          }
                        ],
                        "spiralStairs": [],
                        "parking": {
                          "cars": [],
                          "openCars": [],
                          "coverCars": [],
                          "basementCars": [],
                          "visitors": [],
                          "validCarParkingSlots": 0,
                          "validOpenCarSlots": 0,
                          "validCoverCarSlots": 0,
                          "validBasementCarSlots": 0,
                          "diningSeats": 0,
                          "loadUnload": [],
                          "mechParking": [],
                          "twoWheelers": [],
                          "disabledPersons": [],
                          "validDAParkingSlots": 0,
                          "distFromDAToMainEntrance": 0,
                          "special": [],
                          "validSpecialSlots": 0,
                          "stilts": [],
                          "mechanicalLifts": []
                        },
                        "floorHeights": [],
                        "acRoom": null,
                        "regularRoom": null,
                        "kitchen": null,
                        "bathRoom": {
                          "rooms": [],
                          "heights": []
                        },
                        "waterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "bathRoomWaterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "heightFromTheFloorToCeiling": null,
                        "heightOfTheCeilingOfUpperBasement": null,
                        "balconies": [],
                        "overHangs": [],
                        "washBasins": [],
                        "terrace": false
                      },
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "occupancies": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "type": "Residential",
                            "typeHelper": {
                              "type": {
                                "color": null,
                                "code": "A",
                                "name": "Residential"
                              },
                              "subtype": {
                                "color": 25,
                                "code": "A-R",
                                "name": "Residential"
                              },
                              "usage": null,
                              "convertedType": null,
                              "convertedSubtype": null,
                              "convertedUsage": null
                            },
                            "deduction": 0.9655,
                            "builtUpArea": 7.4005,
                            "floorArea": 6.435,
                            "carpetArea": 5.6089,
                            "carpetAreaDeduction": 0,
                            "existingBuiltUpArea": 0,
                            "existingFloorArea": 0,
                            "existingCarpetArea": 0,
                            "existingCarpetAreaDeduction": 0,
                            "existingDeduction": 0,
                            "withAttachedBath": false,
                            "withOutAttachedBath": false,
                            "withDinningSpace": false,
                            "recreationalSpace": [],
                            "mezzanineNumber": null,
                            "isMezzanine": false
                          }
                        ],
                        "convertedOccupancies": [],
                        "units": [],
                        "daRooms": [],
                        "ramps": [],
                        "vehicleRamps": [],
                        "lifts": [],
                        "daLifts": [],
                        "exterior": null,
                        "openSpaces": [],
                        "specialWaterClosets": [],
                        "coverageDeduct": [],
                        "name": null,
                        "number": 1,
                        "exitWidthDoor": [],
                        "exitWidthStair": [],
                        "mezzanineFloor": [],
                        "halls": [],
                        "fireStairs": [],
                        "generalStairs": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "number": "1",
                            "stairMeasurements": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 13.199999999991576,
                                "width": 0,
                                "height": 4.19999999999709,
                                "mean": 0,
                                "area": 9.72,
                                "isValid": null,
                                "colorCode": 256
                              }
                            ],
                            "flights": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              },
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "2",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              }
                            ],
                            "landings": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "landingPolylines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 5.396368562876823,
                                    "width": 0,
                                    "height": 1.5073325937146576,
                                    "mean": 0,
                                    "area": 1.795,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "landingPolyLineClosed": true,
                                "lengths": [
                                  1.1744
                                ],
                                "widths": [
                                  1.5052
                                ]
                              }
                            ]
                          }
                        ],
                        "spiralStairs": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "number": "1",
                            "stairMeasurements": null,
                            "flights": [],
                            "landings": [],
                            "circles": [
                              {
                                "radius": 0.75
                              }
                            ]
                          }
                        ],
                        "parking": {
                          "cars": [],
                          "openCars": [],
                          "coverCars": [],
                          "basementCars": [],
                          "visitors": [],
                          "validCarParkingSlots": 0,
                          "validOpenCarSlots": 0,
                          "validCoverCarSlots": 0,
                          "validBasementCarSlots": 0,
                          "diningSeats": 0,
                          "loadUnload": [],
                          "mechParking": [],
                          "twoWheelers": [],
                          "disabledPersons": [],
                          "validDAParkingSlots": 0,
                          "distFromDAToMainEntrance": 0,
                          "special": [],
                          "validSpecialSlots": 0,
                          "stilts": [],
                          "mechanicalLifts": []
                        },
                        "floorHeights": [],
                        "acRoom": null,
                        "regularRoom": null,
                        "kitchen": null,
                        "bathRoom": {
                          "rooms": [],
                          "heights": []
                        },
                        "waterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "bathRoomWaterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "heightFromTheFloorToCeiling": null,
                        "heightOfTheCeilingOfUpperBasement": null,
                        "balconies": [],
                        "overHangs": [],
                        "washBasins": [],
                        "terrace": false
                      }
                    ],
                    "floorsAboveGround": 2,
                    "distanceFromBuildingFootPrintToRoadEnd": [],
                    "distanceFromSetBackToBuildingLine": [],
                    "totalBuitUpArea": 59.8405,
                    "totalExistingBuiltUpArea": 0,
                    "mostRestrictiveOccupancy": null,
                    "mostRestrictiveOccupancyType": null,
                    "mostRestrictiveFarHelper": {
                      "type": {
                        "color": null,
                        "code": "A",
                        "name": "Residential"
                      },
                      "subtype": {
                        "color": 25,
                        "code": "A-R",
                        "name": "Residential"
                      },
                      "usage": null,
                      "convertedType": null,
                      "convertedSubtype": null,
                      "convertedUsage": null
                    },
                    "occupancies": [
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "type": null,
                        "typeHelper": {
                          "type": {
                            "color": null,
                            "code": "A",
                            "name": "Residential"
                          },
                          "subtype": {
                            "color": 25,
                            "code": "A-R",
                            "name": "Residential"
                          },
                          "usage": null,
                          "convertedType": null,
                          "convertedSubtype": null,
                          "convertedUsage": null
                        },
                        "deduction": 0,
                        "builtUpArea": 59.8405,
                        "floorArea": 57.9095,
                        "carpetArea": 46.3276,
                        "carpetAreaDeduction": 0,
                        "existingBuiltUpArea": 0,
                        "existingFloorArea": 0,
                        "existingCarpetArea": 0,
                        "existingCarpetAreaDeduction": 0,
                        "existingDeduction": 0,
                        "withAttachedBath": false,
                        "withOutAttachedBath": false,
                        "withDinningSpace": false,
                        "recreationalSpace": [],
                        "mezzanineNumber": null,
                        "isMezzanine": false
                      }
                    ],
                    "totalArea": [
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "type": null,
                        "typeHelper": {
                          "type": {
                            "color": null,
                            "code": "A",
                            "name": "Residential"
                          },
                          "subtype": {
                            "color": 25,
                            "code": "A-R",
                            "name": "Residential"
                          },
                          "usage": null,
                          "convertedType": null,
                          "convertedSubtype": null,
                          "convertedUsage": null
                        },
                        "deduction": 0,
                        "builtUpArea": 59.8405,
                        "floorArea": 57.9095,
                        "carpetArea": 46.3276,
                        "carpetAreaDeduction": 0,
                        "existingBuiltUpArea": 0,
                        "existingFloorArea": 0,
                        "existingCarpetArea": 0,
                        "existingCarpetAreaDeduction": 0,
                        "existingDeduction": 0,
                        "withAttachedBath": false,
                        "withOutAttachedBath": false,
                        "withDinningSpace": false,
                        "recreationalSpace": [],
                        "mezzanineNumber": null,
                        "isMezzanine": false
                      }
                    ],
                    "passage": null,
                    "headRoom": null,
                    "isHighRise": false
                  },
                  "name": "1",
                  "number": "1",
                  "numberOfLifts": "0",
                  "setBacks": [
                    {
                      "frontYard": {
                        "presentInDxf": true,
                        "minimumDistance": 4.26,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 4.3,
                        "area": 42.886,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "rearYard": {
                        "presentInDxf": true,
                        "minimumDistance": 1.62,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 3.3,
                        "area": 28.0563,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "sideYard1": {
                        "presentInDxf": true,
                        "minimumDistance": 1.52,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 1.52,
                        "area": 9.88,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "sideYard2": {
                        "presentInDxf": true,
                        "minimumDistance": 1,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 1,
                        "area": 7.6203,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "level": 0,
                      "height": null,
                      "buildingFootPrint": {
                        "presentInDxf": true,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 52.44,
                        "isValid": null,
                        "colorCode": 0
                      }
                    }
                  ],
                  "coverage": [
                    {
                      "presentInDxf": false,
                      "minimumDistance": 0,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 0,
                      "area": 52.44,
                      "isValid": null,
                      "colorCode": 0
                    }
                  ],
                  "coverageDeductions": [],
                  "typicalFloor": [],
                  "disBetweenBlocks": [],
                  "hallAreas": [],
                  "diningSpaces": [],
                  "sanityDetails": {
                    "maleWaterClosets": [],
                    "femaleWaterClosets": [],
                    "commonWaterClosets": [],
                    "urinals": [],
                    "maleBathRooms": [],
                    "femaleBathRooms": [],
                    "commonBathRooms": [],
                    "maleRoomsWithWaterCloset": [],
                    "femaleRoomsWithWaterCloset": [],
                    "commonRoomsWithWaterCloset": [],
                    "drinkingWater": [],
                    "totalSpecialWC": [],
                    "totalSPWC": 0,
                    "totalwashBasins": 0
                  },
                  "singleFamilyBuilding": true,
                  "residentialBuilding": true,
                  "residentialOrCommercialBuilding": true,
                  "highRiseBuilding": false,
                  "completelyExisting": false,
                  "openStairs": [],
                  "plinthHeight": [
                    1.6,
                    0.6
                  ],
                  "interiorCourtYard": [
                    0.25,
                    0.45
                  ],
                  "protectedBalconies": [],
                  "plantationGreenStripes": [
                    {
                      "presentInDxf": false,
                      "minimumDistance": 0,
                      "minimumSide": 0.8646036723697739,
                      "length": 13.779101416383131,
                      "width": 0.8646036723697739,
                      "height": 6.056658684987947,
                      "mean": 0,
                      "area": 5.2637,
                      "isValid": null,
                      "colorCode": 256
                    }
                  ],
                  "roofTanks": [],
                  "stairCovers": [],
                  "chimneys": [],
                  "parapets": [],
                  "fireTenderMovement": null,
                  "daramps": [
                    {
                      "presentInDxf": true,
                      "minimumDistance": 0,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 0,
                      "area": 0,
                      "isValid": null,
                      "colorCode": 0,
                      "number": 1,
                      "slope": 0.08,
                      "measurements": [
                        {
                          "presentInDxf": false,
                          "minimumDistance": 0,
                          "minimumSide": 0,
                          "length": 91.8240701311031,
                          "width": 0,
                          "height": 29.349942126985766,
                          "mean": 0,
                          "area": 481.9681,
                          "isValid": null,
                          "colorCode": 256
                        }
                      ]
                    }
                  ],
                  "distanceBetweenBlocks": [],
                  "levelZeroSetBack": {
                    "frontYard": {
                      "presentInDxf": true,
                      "minimumDistance": 4.26,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 4.3,
                      "area": 42.886,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "rearYard": {
                      "presentInDxf": true,
                      "minimumDistance": 1.62,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 3.3,
                      "area": 28.0563,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "sideYard1": {
                      "presentInDxf": true,
                      "minimumDistance": 1.52,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 1.52,
                      "area": 9.88,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "sideYard2": {
                      "presentInDxf": true,
                      "minimumDistance": 1,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 1,
                      "area": 7.6203,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "level": 0,
                    "height": null,
                    "buildingFootPrint": {
                      "presentInDxf": true,
                      "minimumDistance": 0,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 0,
                      "area": 52.44,
                      "isValid": null,
                      "colorCode": 0
                    }
                  }
                }
              ],
              "accessoryBlocks": [],
              "virtualBuilding": {
                "buildingHeight": null,
                "occupancies": [],
                "occupancyTypes": [
                  {
                    "type": {
                      "color": null,
                      "code": "A",
                      "name": "Residential"
                    },
                    "subtype": {
                      "color": 25,
                      "code": "A-R",
                      "name": "Residential"
                    },
                    "usage": null,
                    "convertedType": null,
                    "convertedSubtype": null,
                    "convertedUsage": null
                  }
                ],
                "totalBuitUpArea": 59.8405,
                "totalFloorArea": 57.9095,
                "totalCarpetArea": 55.079,
                "totalExistingBuiltUpArea": 0,
                "totalExistingFloorArea": 0,
                "totalExistingCarpetArea": 0,
                "mostRestrictiveFar": null,
                "mostRestrictiveCoverage": null,
                "mostRestrictiveFarHelper": {
                  "type": {
                    "color": null,
                    "code": "A",
                    "name": "Residential"
                  },
                  "subtype": {
                    "color": 25,
                    "code": "A-R",
                    "name": "Residential"
                  },
                  "usage": null,
                  "convertedType": null,
                  "convertedSubtype": null,
                  "convertedUsage": null
                },
                "mostRestrictiveCoverageHelper": null,
                "floorsAboveGround": null,
                "totalCoverageArea": 52.44,
                "residentialOrCommercialBuilding": true,
                "residentialBuilding": true
              },
              "building": {
                "presentInDxf": false,
                "minimumDistance": 0,
                "minimumSide": 0,
                "length": 0,
                "width": 0,
                "height": 0,
                "mean": 0,
                "area": 0,
                "isValid": null,
                "colorCode": 0,
                "buildingHeight": null,
                "declaredBuildingHeight": null,
                "heightIncreasedBy": null,
                "buildingTopMostHeight": null,
                "totalFloorArea": null,
                "totalExistingFloorArea": null,
                "exteriorWall": null,
                "shade": null,
                "far": null,
                "coverage": null,
                "coverageArea": null,
                "maxFloor": null,
                "totalFloors": null,
                "floors": [],
                "floorsAboveGround": null,
                "distanceFromBuildingFootPrintToRoadEnd": [],
                "distanceFromSetBackToBuildingLine": [],
                "totalBuitUpArea": null,
                "totalExistingBuiltUpArea": null,
                "mostRestrictiveOccupancy": null,
                "mostRestrictiveOccupancyType": null,
                "mostRestrictiveFarHelper": null,
                "occupancies": [],
                "totalArea": [],
                "passage": null,
                "headRoom": null,
                "isHighRise": false
              },
              "coverage": 10.26,
              "coverageArea": 52.44,
              "far": 0,
              "totalBuiltUpArea": null,
              "totalFloorArea": null,
              "edcrPassed": true,
              "applicationDate": 1571825729042,
              "electricLine": [
                {
                  "presentInDxf": true,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 0,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0,
                  "number": "1",
                  "verticalDistance": null,
                  "horizontalDistance": 7.2064,
                  "voltage": 110
                }
              ],
              "nonNotifiedRoads": [],
              "notifiedRoads": [],
              "occupancies": [
                {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 0,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0,
                  "type": null,
                  "typeHelper": {
                    "type": {
                      "color": null,
                      "code": "A",
                      "name": "Residential"
                    },
                    "subtype": {
                      "color": 25,
                      "code": "A-R",
                      "name": "Residential"
                    },
                    "usage": null,
                    "convertedType": null,
                    "convertedSubtype": null,
                    "convertedUsage": null
                  },
                  "deduction": 0,
                  "builtUpArea": 59.8405,
                  "floorArea": 57.9095,
                  "carpetArea": 46.3276,
                  "carpetAreaDeduction": 0,
                  "existingBuiltUpArea": 0,
                  "existingFloorArea": 0,
                  "existingCarpetArea": 0,
                  "existingCarpetAreaDeduction": 0,
                  "existingDeduction": 0,
                  "withAttachedBath": false,
                  "withOutAttachedBath": false,
                  "withDinningSpace": false,
                  "recreationalSpace": [],
                  "mezzanineNumber": null,
                  "isMezzanine": false
                }
              ],
              "culdeSacRoads": [],
              "laneRoads": [],
              "errors": {},
              "noObjectionCertificates": {},
              "travelDistancesToExit": [],
              "generalInformation": {},
              "basement": null,
              "parkingDetails": {
                "cars": [],
                "openCars": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 3.3410094163206594,
                    "length": 17.580845666463887,
                    "width": 3.3410094163206594,
                    "height": 5.449413416911284,
                    "mean": 0,
                    "area": 18.2065,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 3.3410094163206594,
                    "length": 17.580845666463887,
                    "width": 3.3410094163206594,
                    "height": 5.449413416911284,
                    "mean": 0,
                    "area": 18.2065,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 3.3410094163206594,
                    "length": 17.580845666463887,
                    "width": 3.3410094163206594,
                    "height": 5.449413416911284,
                    "mean": 0,
                    "area": 18.2065,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "coverCars": [],
                "basementCars": [],
                "visitors": [],
                "validCarParkingSlots": 0,
                "validOpenCarSlots": 0,
                "validCoverCarSlots": 0,
                "validBasementCarSlots": 0,
                "diningSeats": 0,
                "loadUnload": [],
                "mechParking": [],
                "twoWheelers": [],
                "disabledPersons": [],
                "validDAParkingSlots": 0,
                "distFromDAToMainEntrance": 0,
                "special": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 20.28866829341375,
                    "length": 113.92986211028403,
                    "width": 20.28866829341375,
                    "height": 31.124549770575747,
                    "mean": 0,
                    "area": 854.993,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "validSpecialSlots": 1,
                "stilts": [],
                "mechanicalLifts": []
              },
              "canopyDistanceFromPlotBoundary": null,
              "farDetails": {
                "permissableFar": 1.2,
                "providedFar": 0.11
              },
              "distancesFromMonument": [
                482.4641
              ],
              "distancesFromGovtBuilding": [
                185.7801
              ],
              "distancesFromRiverGangaEdge": [],
              "distancesFromRiverNonGanga": [
                304.6637,
                382.8538
              ],
              "distancesFromProtectionWallGanga": [],
              "distancesFromEmbankmentGanga": [],
              "septicTanks": [],
              "plantation": {
                "plantations": []
              },
              "guardRoom": {
                "guardRooms": [],
                "cabinHeights": []
              },
              "segregatedToilet": {
                "segregatedToilets": [],
                "distancesToMainEntrance": []
              },
              "northDirection": {
                "direction": "North",
                "directions": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 24.9985570529199,
                    "width": 0,
                    "height": 21.07632941239109,
                    "mean": 0,
                    "area": 25.9469,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.970158881092167,
                    "width": 0,
                    "height": 3.970158881092167,
                    "mean": 0,
                    "area": 0,
                    "isValid": null,
                    "colorCode": 256
                  }
                ]
              },
              "locationPlans": [
                {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0.09848752061856203,
                  "length": 136.31773111862432,
                  "width": 0.09848752061856203,
                  "height": 49.24464668903312,
                  "mean": 0,
                  "area": 929.6377,
                  "isValid": null,
                  "colorCode": 256
                }
              ],
              "surrenderRoads": [],
              "surrenderRoadArea": 0,
              "depthCuttings": []
            },
            "tenantId": "state"
          }
        ]
      }
    }
  ]
  export const scrutinyDetailsMockJson1 = [
    {
      "name": "New Plan Scrutiny",
      "originalRequest": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "name": "Content-Type",
            "value": "multipart/form-data",
            "type": "text"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "edcrRequest",
              "value": {
                "transactionNumber": "136",
                "edcrNumber": "123",
                "planFile": null,
                "tenantId": "state",
                "RequestInfo": {
                  "apiId": "",
                  "ver": "",
                  "ts": "",
                  "action": "",
                  "did": "",
                  "authToken": "92051a7f-4c98-422d-a31c-d726601bafe5",
                  "key": "",
                  "msgId": "",
                  "correlationId": "",
                  "userInfo": {
                    "id": ""
                  }
                }
              },
              "type": "text"
            },
            {
              "key": "planFile",
              "type": "file",
              "src": "/home/vinoth/Downloads/High_Accepted_STAIR_NEW(3).dxf"
            }
          ]
        },
        "url": {
          "raw": "http://local.test.in.state:9880/edcr/rest/dcr/scrutinizeplan?tenantId=state",
          "protocol": "http",
          "host": [
            "local",
            "test",
            "in",
            "state"
          ],
          "port": "9880",
          "path": [
            "edcr",
            "rest",
            "dcr",
            "scrutinizeplan"
          ],
          "query": [
            {
              "key": "tenantId",
              "value": "state"
            }
          ]
        }
      },
      "status": "OK",
      "code": 200,
      "_postman_previewlanguage": "json",
      "header": [
        {
          "key": "Expires",
          "value": "-1"
        },
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "X-Powered-By",
          "value": "Undertow/1"
        },
        {
          "key": "Set-Cookie",
          "value": "SESSIONID=8838c1e8-667d-44df-af68-4cfe8ecf952f; path=/; domain=test.in; HttpOnly"
        },
        {
          "key": "Server",
          "value": "WildFly/11"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Date",
          "value": "Wed, 23 Oct 2019 10:15:48 GMT"
        },
        {
          "key": "Connection",
          "value": "keep-alive"
        },
        {
          "key": "Vary",
          "value": "*"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Transfer-Encoding",
          "value": "chunked"
        },
        {
          "key": "Content-Type",
          "value": "application/json;charset=UTF-8"
        }
      ],
      "cookie": {},
      "body": {
        "responseInfo": {
          "apiId": "",
          "ver": "",
          "ts": null,
          "resMsgId": "",
          "msgId": "",
          "status": "successful"
        },
        "edcrDetail": [
          {
            "dxfFile": "",
            "updatedDxfFile": "",
            "planReport": "",
            "transactionNumber": "136",
            "status": "Accepted",
            "edcrNumber": "",
            "planPdfs": [
              "",
              ""
            ],
            "planDetail": {
              "utility": {
                "presentInDxf": false,
                "minimumDistance": 0,
                "minimumSide": 0,
                "length": 0,
                "width": 0,
                "height": 0,
                "mean": 0,
                "area": 0,
                "isValid": null,
                "colorCode": 0,
                "wasteDisposalUnits": [],
                "wasteWaterRecyclePlant": [],
                "liquidWasteTreatementPlant": [],
                "wells": [],
                "wellDistance": [],
                "rainWaterHarvest": [
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999545266,
                    "width": 0.9999999999564086,
                    "height": 0.9999999999995643,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.398201349668787,
                    "width": 1.199999999700878,
                    "height": 2.5000000000004476,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999983054,
                    "width": 0.9999999999990462,
                    "height": 1.0000000000000684,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "solar": [
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.999999999998371,
                    "width": 0,
                    "height": 1.0000000000000684,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": true,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999982205,
                    "width": 0,
                    "height": 1.0000000000000588,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "rainWaterHarvestingTankCapacity": null,
                "biometricWasteTreatment": [],
                "solidLiqdWasteTrtmnt": [],
                "solarWaterHeatingSystems": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.398201349668694,
                    "width": 0,
                    "height": 2.500000000000467,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.398201349668787,
                    "width": 0,
                    "height": 2.5000000000004476,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "segregationOfWaste": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 7.39820134966874,
                    "width": 0,
                    "height": 2.5000000000004476,
                    "mean": 0,
                    "area": 2.9989,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.9999999999545457,
                    "width": 0,
                    "height": 0.9999999999995643,
                    "mean": 0,
                    "area": 1,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "waterTankCapacity": null
              },
              "planInformation": {
                "plotArea": 511,
                "ownerName": null,
                "occupancy": "Residential",
                "serviceType": null,
                "amenities": null,
                "architectInformation": null,
                "acchitectId": null,
                "applicantName": null,
                "crzZoneArea": true,
                "crzZoneDesc": "NA",
                "demolitionArea": 15,
                "depthCutting": null,
                "depthCuttingDesc": "NA",
                "governmentOrAidedSchool": null,
                "securityZone": true,
                "securityZoneDesc": "NA",
                "accessWidth": null,
                "noOfBeds": null,
                "nocToAbutSideDesc": "NA",
                "nocToAbutRearDesc": "NA",
                "openingOnSide": false,
                "openingOnSideBelow2mtsDesc": "NA",
                "openingOnSideAbove2mtsDesc": "NA",
                "openingOnRearBelow2mtsDesc": "NA",
                "openingOnRearAbove2mtsDesc": "NA",
                "openingOnRear": false,
                "parkingToMainBuilding": false,
                "noOfSeats": 0,
                "noOfMechanicalParking": 0,
                "singleFamilyBuilding": null,
                "reSurveyNo": null,
                "revenueWard": null,
                "desam": null,
                "village": null,
                "zoneWise": null,
                "landUseZone": "RESIDENTIAL",
                "leaseHoldLand": "NO",
                "roadWidth": 3,
                "roadLength": 0,
                "typeOfArea": "OLD",
                "depthOfPlot": 9,
                "widthOfPlot": 11,
                "buildingNearMonument": "YES",
                "buildingNearGovtBuilding": "YES",
                "nocNearMonument": "YES",
                "nocNearAirport": "YES",
                "nocNearDefenceAerodomes": "YES",
                "nocStateEnvImpact": "YES",
                "nocRailways": "YES",
                "nocCollectorGvtLand": "YES",
                "nocIrrigationDept": "YES",
                "nocFireDept": "NA",
                "buildingNearToRiver": "YES",
                "barrierFreeAccessForPhyChlngdPpl": "YES",
                "provisionsForGreenBuildingsAndSustainability": "YES",
                "fireProtectionAndFireSafetyRequirements": "NA",
                "plotNo": "82/1 (TP:82/100)",
                "khataNo": "21 (EW:56)",
                "mauza": "MUSHARI",
                "district": "MITHUNPURA",
                "rwhDeclared": "YES"
              },
              "plot": {
                "presentInDxf": true,
                "minimumDistance": 0,
                "minimumSide": 0,
                "length": 0,
                "width": 0,
                "height": 0,
                "mean": 0,
                "area": 511,
                "isValid": null,
                "colorCode": 0,
                "frontYard": null,
                "rearYard": null,
                "sideYard1": null,
                "sideYard2": null,
                "setBacks": [],
                "buildingFootPrint": {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 0,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0
                },
                "bsmtFrontYard": null,
                "bsmtRearYard": null,
                "bsmtSideYard1": null,
                "bsmtSideYard2": null,
                "smallPlot": false,
                "plotBndryArea": 172.1566,
                "levelZeroSetBack": null
              },
              "blocks": [
                {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 3.66,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0,
                  "building": {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 0,
                    "width": 0,
                    "height": 0,
                    "mean": 0,
                    "area": 0,
                    "isValid": null,
                    "colorCode": 0,
                    "buildingHeight": 3.66,
                    "declaredBuildingHeight": 3.66,
                    "heightIncreasedBy": null,
                    "buildingTopMostHeight": null,
                    "totalFloorArea": 57.9095,
                    "totalExistingFloorArea": 0,
                    "exteriorWall": null,
                    "shade": null,
                    "far": null,
                    "coverage": 10.26,
                    "coverageArea": 52.44,
                    "maxFloor": 2,
                    "totalFloors": 2,
                    "floors": [
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "occupancies": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "type": "Residential",
                            "typeHelper": {
                              "type": {
                                "color": null,
                                "code": "A",
                                "name": "Residential"
                              },
                              "subtype": {
                                "color": 25,
                                "code": "A-R",
                                "name": "Residential"
                              },
                              "usage": null,
                              "convertedType": null,
                              "convertedSubtype": null,
                              "convertedUsage": null
                            },
                            "deduction": 0.9655,
                            "builtUpArea": 52.44,
                            "floorArea": 51.4745,
                            "carpetArea": 49.4701,
                            "carpetAreaDeduction": 0,
                            "existingBuiltUpArea": 0,
                            "existingFloorArea": 0,
                            "existingCarpetArea": 0,
                            "existingCarpetAreaDeduction": 0,
                            "existingDeduction": 0,
                            "withAttachedBath": false,
                            "withOutAttachedBath": false,
                            "withDinningSpace": false,
                            "recreationalSpace": [],
                            "mezzanineNumber": null,
                            "isMezzanine": false
                          }
                        ],
                        "convertedOccupancies": [],
                        "units": [],
                        "daRooms": [],
                        "ramps": [],
                        "vehicleRamps": [],
                        "lifts": [],
                        "daLifts": [],
                        "exterior": null,
                        "openSpaces": [],
                        "specialWaterClosets": [],
                        "coverageDeduct": [],
                        "name": null,
                        "number": 0,
                        "exitWidthDoor": [],
                        "exitWidthStair": [],
                        "mezzanineFloor": [],
                        "halls": [],
                        "fireStairs": [],
                        "generalStairs": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "number": "1",
                            "stairMeasurements": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 13.199999999991576,
                                "width": 0,
                                "height": 4.19999999999709,
                                "mean": 0,
                                "area": 9.72,
                                "isValid": null,
                                "colorCode": 256
                              }
                            ],
                            "flights": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              },
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "2",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              }
                            ],
                            "landings": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "landingPolylines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 5.396368562876653,
                                    "width": 0,
                                    "height": 1.5073325937146007,
                                    "mean": 0,
                                    "area": 1.795,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "landingPolyLineClosed": true,
                                "lengths": [
                                  1.1744
                                ],
                                "widths": [
                                  1.5052
                                ]
                              }
                            ]
                          }
                        ],
                        "spiralStairs": [],
                        "parking": {
                          "cars": [],
                          "openCars": [],
                          "coverCars": [],
                          "basementCars": [],
                          "visitors": [],
                          "validCarParkingSlots": 0,
                          "validOpenCarSlots": 0,
                          "validCoverCarSlots": 0,
                          "validBasementCarSlots": 0,
                          "diningSeats": 0,
                          "loadUnload": [],
                          "mechParking": [],
                          "twoWheelers": [],
                          "disabledPersons": [],
                          "validDAParkingSlots": 0,
                          "distFromDAToMainEntrance": 0,
                          "special": [],
                          "validSpecialSlots": 0,
                          "stilts": [],
                          "mechanicalLifts": []
                        },
                        "floorHeights": [],
                        "acRoom": null,
                        "regularRoom": null,
                        "kitchen": null,
                        "bathRoom": {
                          "rooms": [],
                          "heights": []
                        },
                        "waterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "bathRoomWaterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "heightFromTheFloorToCeiling": null,
                        "heightOfTheCeilingOfUpperBasement": null,
                        "balconies": [],
                        "overHangs": [],
                        "washBasins": [],
                        "terrace": false
                      },
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "occupancies": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "type": "Residential",
                            "typeHelper": {
                              "type": {
                                "color": null,
                                "code": "A",
                                "name": "Residential"
                              },
                              "subtype": {
                                "color": 25,
                                "code": "A-R",
                                "name": "Residential"
                              },
                              "usage": null,
                              "convertedType": null,
                              "convertedSubtype": null,
                              "convertedUsage": null
                            },
                            "deduction": 0.9655,
                            "builtUpArea": 7.4005,
                            "floorArea": 6.435,
                            "carpetArea": 5.6089,
                            "carpetAreaDeduction": 0,
                            "existingBuiltUpArea": 0,
                            "existingFloorArea": 0,
                            "existingCarpetArea": 0,
                            "existingCarpetAreaDeduction": 0,
                            "existingDeduction": 0,
                            "withAttachedBath": false,
                            "withOutAttachedBath": false,
                            "withDinningSpace": false,
                            "recreationalSpace": [],
                            "mezzanineNumber": null,
                            "isMezzanine": false
                          }
                        ],
                        "convertedOccupancies": [],
                        "units": [],
                        "daRooms": [],
                        "ramps": [],
                        "vehicleRamps": [],
                        "lifts": [],
                        "daLifts": [],
                        "exterior": null,
                        "openSpaces": [],
                        "specialWaterClosets": [],
                        "coverageDeduct": [],
                        "name": null,
                        "number": 1,
                        "exitWidthDoor": [],
                        "exitWidthStair": [],
                        "mezzanineFloor": [],
                        "halls": [],
                        "fireStairs": [],
                        "generalStairs": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "number": "1",
                            "stairMeasurements": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 13.199999999991576,
                                "width": 0,
                                "height": 4.19999999999709,
                                "mean": 0,
                                "area": 9.72,
                                "isValid": null,
                                "colorCode": 256
                              }
                            ],
                            "flights": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              },
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "2",
                                "noOfRises": 9,
                                "flightPolyLines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 8.399999999997817,
                                    "width": 0,
                                    "height": 3,
                                    "mean": 0,
                                    "area": 3.6,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "flightPolyLineClosed": true,
                                "lengthOfFlights": [
                                  3
                                ],
                                "widthOfFlights": [
                                  1.2
                                ]
                              }
                            ],
                            "landings": [
                              {
                                "presentInDxf": false,
                                "minimumDistance": 0,
                                "minimumSide": 0,
                                "length": 0,
                                "width": 0,
                                "height": 0,
                                "mean": 0,
                                "area": 0,
                                "isValid": null,
                                "colorCode": 0,
                                "number": "1",
                                "landingPolylines": [
                                  {
                                    "presentInDxf": false,
                                    "minimumDistance": 0,
                                    "minimumSide": 0,
                                    "length": 5.396368562876823,
                                    "width": 0,
                                    "height": 1.5073325937146576,
                                    "mean": 0,
                                    "area": 1.795,
                                    "isValid": null,
                                    "colorCode": 256
                                  }
                                ],
                                "landingPolyLineClosed": true,
                                "lengths": [
                                  1.1744
                                ],
                                "widths": [
                                  1.5052
                                ]
                              }
                            ]
                          }
                        ],
                        "spiralStairs": [
                          {
                            "presentInDxf": false,
                            "minimumDistance": 0,
                            "minimumSide": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "mean": 0,
                            "area": 0,
                            "isValid": null,
                            "colorCode": 0,
                            "number": "1",
                            "stairMeasurements": null,
                            "flights": [],
                            "landings": [],
                            "circles": [
                              {
                                "radius": 0.75
                              }
                            ]
                          }
                        ],
                        "parking": {
                          "cars": [],
                          "openCars": [],
                          "coverCars": [],
                          "basementCars": [],
                          "visitors": [],
                          "validCarParkingSlots": 0,
                          "validOpenCarSlots": 0,
                          "validCoverCarSlots": 0,
                          "validBasementCarSlots": 0,
                          "diningSeats": 0,
                          "loadUnload": [],
                          "mechParking": [],
                          "twoWheelers": [],
                          "disabledPersons": [],
                          "validDAParkingSlots": 0,
                          "distFromDAToMainEntrance": 0,
                          "special": [],
                          "validSpecialSlots": 0,
                          "stilts": [],
                          "mechanicalLifts": []
                        },
                        "floorHeights": [],
                        "acRoom": null,
                        "regularRoom": null,
                        "kitchen": null,
                        "bathRoom": {
                          "rooms": [],
                          "heights": []
                        },
                        "waterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "bathRoomWaterClosets": {
                          "rooms": [],
                          "heights": []
                        },
                        "heightFromTheFloorToCeiling": null,
                        "heightOfTheCeilingOfUpperBasement": null,
                        "balconies": [],
                        "overHangs": [],
                        "washBasins": [],
                        "terrace": false
                      }
                    ],
                    "floorsAboveGround": 2,
                    "distanceFromBuildingFootPrintToRoadEnd": [],
                    "distanceFromSetBackToBuildingLine": [],
                    "totalBuitUpArea": 59.8405,
                    "totalExistingBuiltUpArea": 0,
                    "mostRestrictiveOccupancy": null,
                    "mostRestrictiveOccupancyType": null,
                    "mostRestrictiveFarHelper": {
                      "type": {
                        "color": null,
                        "code": "A",
                        "name": "Residential"
                      },
                      "subtype": {
                        "color": 25,
                        "code": "A-R",
                        "name": "Residential"
                      },
                      "usage": null,
                      "convertedType": null,
                      "convertedSubtype": null,
                      "convertedUsage": null
                    },
                    "occupancies": [
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "type": null,
                        "typeHelper": {
                          "type": {
                            "color": null,
                            "code": "A",
                            "name": "Residential"
                          },
                          "subtype": {
                            "color": 25,
                            "code": "A-R",
                            "name": "Residential"
                          },
                          "usage": null,
                          "convertedType": null,
                          "convertedSubtype": null,
                          "convertedUsage": null
                        },
                        "deduction": 0,
                        "builtUpArea": 59.8405,
                        "floorArea": 57.9095,
                        "carpetArea": 46.3276,
                        "carpetAreaDeduction": 0,
                        "existingBuiltUpArea": 0,
                        "existingFloorArea": 0,
                        "existingCarpetArea": 0,
                        "existingCarpetAreaDeduction": 0,
                        "existingDeduction": 0,
                        "withAttachedBath": false,
                        "withOutAttachedBath": false,
                        "withDinningSpace": false,
                        "recreationalSpace": [],
                        "mezzanineNumber": null,
                        "isMezzanine": false
                      }
                    ],
                    "totalArea": [
                      {
                        "presentInDxf": false,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 0,
                        "isValid": null,
                        "colorCode": 0,
                        "type": null,
                        "typeHelper": {
                          "type": {
                            "color": null,
                            "code": "A",
                            "name": "Residential"
                          },
                          "subtype": {
                            "color": 25,
                            "code": "A-R",
                            "name": "Residential"
                          },
                          "usage": null,
                          "convertedType": null,
                          "convertedSubtype": null,
                          "convertedUsage": null
                        },
                        "deduction": 0,
                        "builtUpArea": 59.8405,
                        "floorArea": 57.9095,
                        "carpetArea": 46.3276,
                        "carpetAreaDeduction": 0,
                        "existingBuiltUpArea": 0,
                        "existingFloorArea": 0,
                        "existingCarpetArea": 0,
                        "existingCarpetAreaDeduction": 0,
                        "existingDeduction": 0,
                        "withAttachedBath": false,
                        "withOutAttachedBath": false,
                        "withDinningSpace": false,
                        "recreationalSpace": [],
                        "mezzanineNumber": null,
                        "isMezzanine": false
                      }
                    ],
                    "passage": null,
                    "headRoom": null,
                    "isHighRise": false
                  },
                  "name": "1",
                  "number": "1",
                  "numberOfLifts": "0",
                  "setBacks": [
                    {
                      "frontYard": {
                        "presentInDxf": true,
                        "minimumDistance": 4.26,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 4.3,
                        "area": 42.886,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "rearYard": {
                        "presentInDxf": true,
                        "minimumDistance": 1.62,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 3.3,
                        "area": 28.0563,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "sideYard1": {
                        "presentInDxf": true,
                        "minimumDistance": 1.52,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 1.52,
                        "area": 9.88,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "sideYard2": {
                        "presentInDxf": true,
                        "minimumDistance": 1,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 1,
                        "area": 7.6203,
                        "isValid": null,
                        "colorCode": 0,
                        "level": 0,
                        "dimensions": []
                      },
                      "level": 0,
                      "height": null,
                      "buildingFootPrint": {
                        "presentInDxf": true,
                        "minimumDistance": 0,
                        "minimumSide": 0,
                        "length": 0,
                        "width": 0,
                        "height": 0,
                        "mean": 0,
                        "area": 52.44,
                        "isValid": null,
                        "colorCode": 0
                      }
                    }
                  ],
                  "coverage": [
                    {
                      "presentInDxf": false,
                      "minimumDistance": 0,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 0,
                      "area": 52.44,
                      "isValid": null,
                      "colorCode": 0
                    }
                  ],
                  "coverageDeductions": [],
                  "typicalFloor": [],
                  "disBetweenBlocks": [],
                  "hallAreas": [],
                  "diningSpaces": [],
                  "sanityDetails": {
                    "maleWaterClosets": [],
                    "femaleWaterClosets": [],
                    "commonWaterClosets": [],
                    "urinals": [],
                    "maleBathRooms": [],
                    "femaleBathRooms": [],
                    "commonBathRooms": [],
                    "maleRoomsWithWaterCloset": [],
                    "femaleRoomsWithWaterCloset": [],
                    "commonRoomsWithWaterCloset": [],
                    "drinkingWater": [],
                    "totalSpecialWC": [],
                    "totalSPWC": 0,
                    "totalwashBasins": 0
                  },
                  "singleFamilyBuilding": true,
                  "residentialBuilding": true,
                  "residentialOrCommercialBuilding": true,
                  "highRiseBuilding": false,
                  "completelyExisting": false,
                  "openStairs": [],
                  "plinthHeight": [
                    1.6,
                    0.6
                  ],
                  "interiorCourtYard": [
                    0.25,
                    0.45
                  ],
                  "protectedBalconies": [],
                  "plantationGreenStripes": [
                    {
                      "presentInDxf": false,
                      "minimumDistance": 0,
                      "minimumSide": 0.8646036723697739,
                      "length": 13.779101416383131,
                      "width": 0.8646036723697739,
                      "height": 6.056658684987947,
                      "mean": 0,
                      "area": 5.2637,
                      "isValid": null,
                      "colorCode": 256
                    }
                  ],
                  "roofTanks": [],
                  "stairCovers": [],
                  "chimneys": [],
                  "parapets": [],
                  "fireTenderMovement": null,
                  "daramps": [
                    {
                      "presentInDxf": true,
                      "minimumDistance": 0,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 0,
                      "area": 0,
                      "isValid": null,
                      "colorCode": 0,
                      "number": 1,
                      "slope": 0.08,
                      "measurements": [
                        {
                          "presentInDxf": false,
                          "minimumDistance": 0,
                          "minimumSide": 0,
                          "length": 91.8240701311031,
                          "width": 0,
                          "height": 29.349942126985766,
                          "mean": 0,
                          "area": 481.9681,
                          "isValid": null,
                          "colorCode": 256
                        }
                      ]
                    }
                  ],
                  "distanceBetweenBlocks": [],
                  "levelZeroSetBack": {
                    "frontYard": {
                      "presentInDxf": true,
                      "minimumDistance": 4.26,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 4.3,
                      "area": 42.886,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "rearYard": {
                      "presentInDxf": true,
                      "minimumDistance": 1.62,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 3.3,
                      "area": 28.0563,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "sideYard1": {
                      "presentInDxf": true,
                      "minimumDistance": 1.52,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 1.52,
                      "area": 9.88,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "sideYard2": {
                      "presentInDxf": true,
                      "minimumDistance": 1,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 1,
                      "area": 7.6203,
                      "isValid": null,
                      "colorCode": 0,
                      "level": 0,
                      "dimensions": []
                    },
                    "level": 0,
                    "height": null,
                    "buildingFootPrint": {
                      "presentInDxf": true,
                      "minimumDistance": 0,
                      "minimumSide": 0,
                      "length": 0,
                      "width": 0,
                      "height": 0,
                      "mean": 0,
                      "area": 52.44,
                      "isValid": null,
                      "colorCode": 0
                    }
                  }
                }
              ],
              "accessoryBlocks": [],
              "virtualBuilding": {
                "buildingHeight": null,
                "occupancies": [],
                "occupancyTypes": [
                  {
                    "type": {
                      "color": null,
                      "code": "A",
                      "name": "Residential"
                    },
                    "subtype": {
                      "color": 25,
                      "code": "A-R",
                      "name": "Residential"
                    },
                    "usage": null,
                    "convertedType": null,
                    "convertedSubtype": null,
                    "convertedUsage": null
                  }
                ],
                "totalBuitUpArea": 59.8405,
                "totalFloorArea": 57.9095,
                "totalCarpetArea": 55.079,
                "totalExistingBuiltUpArea": 0,
                "totalExistingFloorArea": 0,
                "totalExistingCarpetArea": 0,
                "mostRestrictiveFar": null,
                "mostRestrictiveCoverage": null,
                "mostRestrictiveFarHelper": {
                  "type": {
                    "color": null,
                    "code": "A",
                    "name": "Residential"
                  },
                  "subtype": {
                    "color": 25,
                    "code": "A-R",
                    "name": "Residential"
                  },
                  "usage": null,
                  "convertedType": null,
                  "convertedSubtype": null,
                  "convertedUsage": null
                },
                "mostRestrictiveCoverageHelper": null,
                "floorsAboveGround": null,
                "totalCoverageArea": 52.44,
                "residentialOrCommercialBuilding": true,
                "residentialBuilding": true
              },
              "building": {
                "presentInDxf": false,
                "minimumDistance": 0,
                "minimumSide": 0,
                "length": 0,
                "width": 0,
                "height": 0,
                "mean": 0,
                "area": 0,
                "isValid": null,
                "colorCode": 0,
                "buildingHeight": null,
                "declaredBuildingHeight": null,
                "heightIncreasedBy": null,
                "buildingTopMostHeight": null,
                "totalFloorArea": null,
                "totalExistingFloorArea": null,
                "exteriorWall": null,
                "shade": null,
                "far": null,
                "coverage": null,
                "coverageArea": null,
                "maxFloor": null,
                "totalFloors": null,
                "floors": [],
                "floorsAboveGround": null,
                "distanceFromBuildingFootPrintToRoadEnd": [],
                "distanceFromSetBackToBuildingLine": [],
                "totalBuitUpArea": null,
                "totalExistingBuiltUpArea": null,
                "mostRestrictiveOccupancy": null,
                "mostRestrictiveOccupancyType": null,
                "mostRestrictiveFarHelper": null,
                "occupancies": [],
                "totalArea": [],
                "passage": null,
                "headRoom": null,
                "isHighRise": false
              },
              "coverage": 10.26,
              "coverageArea": 52.44,
              "far": 0,
              "totalBuiltUpArea": null,
              "totalFloorArea": null,
              "edcrPassed": true,
              "applicationDate": 1571825729042,
              "electricLine": [
                {
                  "presentInDxf": true,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 0,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0,
                  "number": "1",
                  "verticalDistance": null,
                  "horizontalDistance": 7.2064,
                  "voltage": 110
                }
              ],
              "nonNotifiedRoads": [],
              "notifiedRoads": [],
              "occupancies": [
                {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0,
                  "length": 0,
                  "width": 0,
                  "height": 0,
                  "mean": 0,
                  "area": 0,
                  "isValid": null,
                  "colorCode": 0,
                  "type": null,
                  "typeHelper": {
                    "type": {
                      "color": null,
                      "code": "A",
                      "name": "Residential"
                    },
                    "subtype": {
                      "color": 25,
                      "code": "A-R",
                      "name": "Residential"
                    },
                    "usage": null,
                    "convertedType": null,
                    "convertedSubtype": null,
                    "convertedUsage": null
                  },
                  "deduction": 0,
                  "builtUpArea": 59.8405,
                  "floorArea": 57.9095,
                  "carpetArea": 46.3276,
                  "carpetAreaDeduction": 0,
                  "existingBuiltUpArea": 0,
                  "existingFloorArea": 0,
                  "existingCarpetArea": 0,
                  "existingCarpetAreaDeduction": 0,
                  "existingDeduction": 0,
                  "withAttachedBath": false,
                  "withOutAttachedBath": false,
                  "withDinningSpace": false,
                  "recreationalSpace": [],
                  "mezzanineNumber": null,
                  "isMezzanine": false
                }
              ],
              "culdeSacRoads": [],
              "laneRoads": [],
              "errors": {},
              "noObjectionCertificates": {},
              "travelDistancesToExit": [],
              "generalInformation": {},
              "basement": null,
              "parkingDetails": {
                "cars": [],
                "openCars": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 3.3410094163206594,
                    "length": 17.580845666463887,
                    "width": 3.3410094163206594,
                    "height": 5.449413416911284,
                    "mean": 0,
                    "area": 18.2065,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 3.3410094163206594,
                    "length": 17.580845666463887,
                    "width": 3.3410094163206594,
                    "height": 5.449413416911284,
                    "mean": 0,
                    "area": 18.2065,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 3.3410094163206594,
                    "length": 17.580845666463887,
                    "width": 3.3410094163206594,
                    "height": 5.449413416911284,
                    "mean": 0,
                    "area": 18.2065,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "coverCars": [],
                "basementCars": [],
                "visitors": [],
                "validCarParkingSlots": 0,
                "validOpenCarSlots": 0,
                "validCoverCarSlots": 0,
                "validBasementCarSlots": 0,
                "diningSeats": 0,
                "loadUnload": [],
                "mechParking": [],
                "twoWheelers": [],
                "disabledPersons": [],
                "validDAParkingSlots": 0,
                "distFromDAToMainEntrance": 0,
                "special": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 20.28866829341375,
                    "length": 113.92986211028403,
                    "width": 20.28866829341375,
                    "height": 31.124549770575747,
                    "mean": 0,
                    "area": 854.993,
                    "isValid": null,
                    "colorCode": 256
                  }
                ],
                "validSpecialSlots": 1,
                "stilts": [],
                "mechanicalLifts": []
              },
              "canopyDistanceFromPlotBoundary": null,
              "farDetails": {
                "permissableFar": 1.2,
                "providedFar": 0.11
              },
              "distancesFromMonument": [
                482.4641
              ],
              "distancesFromGovtBuilding": [
                185.7801
              ],
              "distancesFromRiverGangaEdge": [],
              "distancesFromRiverNonGanga": [
                304.6637,
                382.8538
              ],
              "distancesFromProtectionWallGanga": [],
              "distancesFromEmbankmentGanga": [],
              "septicTanks": [],
              "plantation": {
                "plantations": []
              },
              "guardRoom": {
                "guardRooms": [],
                "cabinHeights": []
              },
              "segregatedToilet": {
                "segregatedToilets": [],
                "distancesToMainEntrance": []
              },
              "northDirection": {
                "direction": "North",
                "directions": [
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 24.9985570529199,
                    "width": 0,
                    "height": 21.07632941239109,
                    "mean": 0,
                    "area": 25.9469,
                    "isValid": null,
                    "colorCode": 256
                  },
                  {
                    "presentInDxf": false,
                    "minimumDistance": 0,
                    "minimumSide": 0,
                    "length": 3.970158881092167,
                    "width": 0,
                    "height": 3.970158881092167,
                    "mean": 0,
                    "area": 0,
                    "isValid": null,
                    "colorCode": 256
                  }
                ]
              },
              "locationPlans": [
                {
                  "presentInDxf": false,
                  "minimumDistance": 0,
                  "minimumSide": 0.09848752061856203,
                  "length": 136.31773111862432,
                  "width": 0.09848752061856203,
                  "height": 49.24464668903312,
                  "mean": 0,
                  "area": 929.6377,
                  "isValid": null,
                  "colorCode": 256
                }
              ],
              "surrenderRoads": [],
              "surrenderRoadArea": 0,
              "depthCuttings": []
            },
            "tenantId": "state"
          }
        ]
      }
    }
  ]