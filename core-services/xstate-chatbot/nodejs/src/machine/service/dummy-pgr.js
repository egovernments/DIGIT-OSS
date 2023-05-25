const fetch = require('node-fetch');
const getCityAndLocality = require('./util/google-maps-util');
const localisationService = require('../util/localisation-service');
const config = require('../../env-variables');

class DummyPGRService {

    // Please mark the method async if the actual app-service method would involve api calls

    async fetchMdmsData(tenantId, moduleName, masterName, filterPath) {
      var url = config.egovServices.egovServicesHost + config.egovServices.mdmsSearchPath;
      var request = {
        "RequestInfo": {},
        "MdmsCriteria": {
          "tenantId": tenantId,
          "moduleDetails": [
            {
              "moduleName": moduleName,
              "masterDetails": [
                {
                  "name": masterName,
                  "filter": filterPath
                }
              ]
            }
          ]
        }
      };
    
      var options = {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json'
        }
      }
    
      let response = await fetch(url, options);
      let data = await response.json()
    
      return data["MdmsRes"][moduleName][masterName];
    }
    async fetchCitiesAndWebpageLink(tenantId,whatsAppBusinessNumber)
    {
      let {cities,messageBundle} = await this.fetchCities(tenantId);
      let link = await this.getCityExternalWebpageLink(tenantId,whatsAppBusinessNumber);
      return {cities,messageBundle,link};
    }
    async fetchCities(tenantId) {
        let cities = this.cities.tenantInfo.map(el=>el.code);
        let messageBundle = this.citiesMessageBundle;
        return {cities, messageBundle};
        // let tenantId = this.cities.tenantId;
        // return this.cities.tenantInfo.map(el=>el.code.replace(`${tenantId}.`, ""));
    }
    async getCityExternalWebpageLink(tenantId, whatsAppBusinessNumber) {
      var url = config.egovServices.externalHost + config.egovServices.cityExternalWebpagePath + '?tenantId=' + tenantId + '&phone=+91' + whatsAppBusinessNumber;
      var shorturl = await this.getShortenedURL(url);
      return shorturl;
    }
    async fetchLocalitiesAndWebpageLink(tenantId,whatsAppBusinessNumber){
      let {localities,messageBundle} = await this.fetchLocalities(tenantId);
      let link = await this.getLocalityExternalWebpageLink(tenantId,whatsAppBusinessNumber);
      return {localities,messageBundle,link};
    }
    async getLocalityExternalWebpageLink(tenantId, whatsAppBusinessNumber) {
      var url = config.egovServices.externalHost + config.egovServices.localityExternalWebpagePath + '?tenantId=' + tenantId + '&phone=+91' + whatsAppBusinessNumber;
      var shorturl = await this.getShortenedURL(url);
      return shorturl;
  }
    async fetchLocalities(tenantId) {
      let moduleName = 'egov-location';
      let masterName = 'TenantBoundary';
      let filterPath = '$.[?(@.hierarchyType.code=="ADMIN")].boundary.children.*.children.*.children.*';
  
      let boundaryData = await this.fetchMdmsData(tenantId, moduleName, masterName, filterPath);
      let localities = [];
      for(let i = 0; i < boundaryData.length; i++) {
        localities.push(boundaryData[i].code);
      }
      let localitiesLocalisationCodes = [];
      for(let locality of localities) {
        let localisationCode = tenantId.replace('.', '_').toUpperCase() + '_ADMIN_' + locality;
        localitiesLocalisationCodes.push(localisationCode);
      }
      let localisedMessages = await localisationService.getMessagesForCodesAndTenantId(localitiesLocalisationCodes, tenantId);
      let messageBundle = {};
      for(let locality of localities) {
        let localisationCode = tenantId.replace('.', '_').toUpperCase() + '_ADMIN_' + locality;
        messageBundle[locality] = localisedMessages[localisationCode]
      }
      return { localities, messageBundle };
    }
    
    async getCityAndLocalityForGeocode(geocode, tenantId) {
        let latlng = geocode.substring(1, geocode.length - 1); // Remove braces
        let cityAndLocality = await getCityAndLocality(latlng);
        return cityAndLocality;
    }
    async fetchComplaintItemsForCategory(category, tenantId) {
        let complaintItems = this.complaintCategoryToItemsMap[category];
        let messageBundle = this.complaintTypesMessageBundle;
        return { complaintItems, messageBundle };
    }
    async fetchComplaintCategories(tenantId) {
        let complaintCategories = Object.keys(this.complaintCategoryToItemsMap);
        let messageBundle = this.complaintCategoriesMessageBundle;
        return { complaintCategories, messageBundle };
    }
    async fetchFrequentComplaints(tenantId) {
        let complaintTypes = [
            'StreetLightNotWorking',
            'BlockOrOverflowingSewage',
            'GarbageNeedsTobeCleared',
            'BrokenWaterPipeOrLeakage'
        ];
        let messageBundle = this.complaintTypesMessageBundle;
        return {complaintTypes, messageBundle};
    }
    async persistComplaint(bundle) {
      console.log('Saving complaint to service: ' + JSON.stringify(bundle));
      return {
        complaintNumber: '04/11/2020/081479',
        complaintLink: 'https://mseva.org/complaint/132'
      }
    }
    async fetchOpenComplaints(user) {
      return [
        {
          complaintType: 'Streetlight not working',
          complaintNumber: '04/11/2020/081478',
          filedDate: '30/11/2020',
          complaintStatus: 'Pending for Assignment',
          complaintLink: 'https://mseva.org/complaint/081478'
        },
        {
          complaintType: 'Garbage not cleared',
          complaintNumber: '04/11/2020/081479',
          filedDate: '30/11/2020',
          complaintStatus: 'Pending for Assignment',
          complaintLink: 'https://mseva.org/complaint/081479'
        }
      ]
    }
    constructor() {
        // 11 November, 2020
        //https://github.com/egovernments/egov-mdms-data/blob/master/data/pb/RAINMAKER-PGR/ServiceDefs.json
        this.complaint_meta_data = {
            "tenantId": "pb",
            "moduleName": "RAINMAKER-PGR",
            "ServiceDefs": [
            {
                "serviceCode": "NoStreetlight",
                "keywords": "streetlight, light, repair, work, pole, electric, power, repair, damage, fix",
                "department": "Streetlights",
                "slaHours": 336,
                "menuPath": "StreetLights",
                "active": false,
                "order": 1
            },
            {
                "serviceCode": "StreetLightNotWorking",
                "keywords": "streetlight, light, repair, work, pole, electric, power, repair, fix",
                "department": "DEPT_1",
                "slaHours": 336,
                "menuPath": "StreetLights",
                "active": true,
                "order": 2
            },
            {
                "serviceCode": "GarbageNeedsTobeCleared",
                "keywords": "garbage, collect, litter, clean, door, waste, remove, sweeper, sanitation, dump, health, debris, throw",
                "department": "DEPT_25",
                "slaHours": 336,
                "menuPath": "Garbage",
                "active": true,
                "order": 3
            },
            {
                "serviceCode": "DamagedGarbageBin",
                "keywords": "garbage, waste, bin, dustbin, clean, remove, sanitation, overflow, smell, health, throw, dispose",
                "department": "DEPT_25",
                "slaHours": 336,
                "menuPath": "Garbage",
                "active": true,
                "order": 4
            },
            {
                "serviceCode": "BurningOfGarbage",
                "keywords": "garbage, remove, burn, fire, health, waste, smoke, plastic, illegal",
                "department": "DEPT_25",
                "slaHours": 336,
                "menuPath": "Garbage",
                "active": true,
                "order": 5
            },
            {
                "serviceCode": "OverflowingOrBlockedDrain",
                "keywords": "drain, block, clean, debris, silt, drainage, water, clean, roadside, flow, remove, waste, garbage, clear, overflow, canal, fill, stagnate, rain, sanitation, sand, pipe, clog, stuck",
                "department": "ENG",
                "slaHours": 336,
                "menuPath": "Drains",
                "active": true
            },
            {
                "serviceCode": "illegalDischargeOfSewage",
                "keywords": "water, supply, connection, damage, repair, broken, pipe, piping, tap",
                "department": "ENG",
                "slaHours": 336,
                "menuPath": "WaterandSewage",
                "active": true
            },
            {
                "serviceCode": "BlockOrOverflowingSewage",
                "keywords": "water, supply, connection, damage, repair, broken, pipe, piping, tap",
                "department": "ENG",
                "slaHours": 336,
                "menuPath": "WaterandSewage",
                "active": true
            },
            {
                "serviceCode": "ShortageOfWater",
                "keywords": "water, supply, shortage, drink, tap, connection,leakage,less",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "WaterandSewage",
                "active": true
            },
            {
                "serviceCode": "NoWaterSupply",
                "keywords": "water, supply, connection, drink, tap",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "WaterandSewage",
                "active": true
            },
            {
                "serviceCode": "DirtyWaterSupply",
                "keywords": "water, supply, connection, drink, dirty, contaminated, impure, health, clean",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "WaterandSewage",
                "active": true
            },
            {
                "serviceCode": "BrokenWaterPipeOrLeakage",
                "keywords": "water, supply, connection, damage, repair, broken, pipe, piping, tap",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "WaterandSewage",
                "active": true
            },
            {
                "serviceCode": "WaterPressureisVeryLess",
                "keywords": "water, supply, connection, damage, repair, broken, pipe, piping, tap",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "WaterandSewage",
                "active": true
            },
            {
                "serviceCode": "DamagedRoad",
                "keywords": "road, damage, hole, surface, repair, patch, broken, maintenance, street, construction, fix",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "RoadsAndFootpaths",
                "active": true
            },
            {
                "serviceCode": "WaterLoggedRoad",
                "keywords": "road, drainage, water, block, puddle, street, flood, overflow, rain",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "RoadsAndFootpaths",
                "active": true
            },
            {
                "serviceCode": "ManholeCoverMissingOrDamaged",
                "keywords": "road, street, manhole, hole, cover, lid, footpath, open, man, drainage, damage, repair, fix",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "RoadsAndFootpaths",
                "active": true
            },
            {
                "serviceCode": "DamagedOrBlockedFootpath",
                "keywords": "footpath, repair, broken, surface, damage, patch, hole, maintenance, walk, path",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "RoadsAndFootpaths",
                "active": true
            },
            {
                "serviceCode": "ConstructionMaterialLyingOntheRoad",
                "keywords": "illegal, shop, footpath, walk, remove, occupy, path",
                "department": "DEPT_4",
                "slaHours": 336,
                "menuPath": "RoadsAndFootpaths",
                "active": true
            },
            {
                "serviceCode": "RequestSprayingOrFoggingOperation",
                "keywords": "mosquito, menace, fog, spray, kill, health, dengue, malaria, disease, clean",
                "department": "DEPT_3",
                "slaHours": 336,
                "menuPath": "Mosquitos",
                "active": true
            },
            {
                "serviceCode": "StrayAnimals",
                "keywords": "stray, dog, dogs, menace, animal, animals, attack, attacking, bite, biting, bark, barking",
                "department": "DEPT_3",
                "slaHours": 336,
                "menuPath": "Animals",
                "active": true
            },
            {
                "serviceCode": "DeadAnimals",
                "keywords": "stray, cow, cows, cattle, bull, bulls, graze, grazing, dung, menace",
                "department": "DEPT_3",
                "slaHours": 336,
                "menuPath": "Animals",
                "active": true
            },
            {
                "serviceCode": "DirtyOrSmellyPublicToilets",
                "keywords": "toilet, public, restroom, bathroom, urinal, smell, dirty",
                "department": "DEPT_3",
                "slaHours": 336,
                "menuPath": "PublicToilets",
                "active": true
            },
            {
                "serviceCode": "PublicToiletIsDamaged",
                "keywords": "toilet, public, restroom, bathroom, urinal, block, working",
                "department": "DEPT_3",
                "slaHours": 336,
                "menuPath": "PublicToilets",
                "active": true
            },
            {
                "serviceCode": "NoWaterOrElectricityinPublicToilet",
                "keywords": "toilet, public, restroom, bathroom, urinal, electricity, water, working",
                "department": "DEPT_3",
                "slaHours": 336,
                "menuPath": "PublicToilets",
                "active": true
            },
            {
                "serviceCode": "IllegalShopsOnFootPath",
                "keywords": "illegal, shop, footpath, violation, property, public, space, land, unathourised, site, construction, wrong",
                "department": "DEPT_6",
                "slaHours": 336,
                "menuPath": "LandViolations",
                "active": true
            },
            {
                "serviceCode": "IllegalConstructions",
                "keywords": "illegal, violation, property, public, space, land, unathourised, site, construction, wrong, build",
                "department": "DEPT_6",
                "slaHours": 336,
                "menuPath": "LandViolations",
                "active": true
            },
            {
                "serviceCode": "IllegalParking",
                "keywords": "illegal, parking, car, vehicle, space, removal, road, street, vehicle",
                "department": "DEPT_6",
                "slaHours": 336,
                "menuPath": "LandViolations",
                "active": true
            },
            {
                "serviceCode": "IllegalCuttingOfTrees",
                "keywords": "tree, cut, illegal, unathourized, remove, plant",
                "department": "DEPT_5",
                "slaHours": 336,
                "menuPath": "Trees",
                "active": true
            },
            {
                "serviceCode": "CuttingOrTrimmingOfTreeRequired",
                "keywords": "tree, remove, trim, fallen, cut, plant, branch",
                "department": "DEPT_5",
                "slaHours": 336,
                "menuPath": "Trees",
                "active": true
            },
            {
                "serviceCode": "OpenDefecation",
                "keywords": "open, defecation, waste, human, privy, toilet",
                "department": "DEPT_3",
                "slaHours": 336,
                "menuPath": "OpenDefecation",
                "active": true
            },
            {
                "serviceCode": "ParkRequiresMaintenance",
                "keywords": "open, defecation, waste, human, privy, toilet",
                "department": "DEPT_5",
                "slaHours": 336,
                "menuPath": "Parks",
                "active": true
            },
            {
                "serviceCode": "Others",
                "keywords": "other, miscellaneous,ad,playgrounds,burial,slaughterhouse, misc, tax, revenue",
                "department": "DEPT_10",
                "slaHours": 336,
                "menuPath": "",
                "active": true,
                "order": 6
            }
            ]
        };
        this.cities = {
            "tenantId": "pb",
            "moduleName": "tenant",
            "tenantInfo": [
                {
                "code": "pb.jalandhar",
                "districtCode": "Barnala",
                "population": "156716",
                "malePopulation": "82045",
                "femalePopultion": "74671",
                "workingPopulation": "37.2",
                "literacyRate": "79.2",
                "languagesSpoken": ["PN", "HN", "EN"]
                },
                {
                "code": "pb.amritsar",
                "districtCode": "Bahadaur",
                "population": "116449",
                "malePopulation": "62554",
                "femalePopultion": "53895",
                "workingPopulation": "35.01",
                "literacyRate": "69.46",
                "languagesSpoken": ["PN", "GR", "HN"]
                },
            
                {
                "code": "pb.patankot",
                "districtCode": "Dhanaula",
                "population": "17331",
                "malePopulation": "10521",
                "femalePopultion": "6810",
                "workingPopulation": "33.48",
                "literacyRate": "62.63",
                "languagesSpoken": ["GR", "PN", "HN"]
                },
                {
                "code": "pb.nawanshahr",
                "districtCode": "Dhanaula",
                "population": "12507",
                "malePopulation": "6810",
                "femalePopultion": "5697",
                "workingPopulation": "33.70",
                "literacyRate": "57.41",
                "languagesSpoken": ["HN", "PN", "EN"]
                }
            ]
        };
        this.complaintCategoryToItemsMap = {};
        this.complaint_meta_data.ServiceDefs.forEach(el=> {
            if (this.complaintCategoryToItemsMap[el.menuPath]) {
                this.complaintCategoryToItemsMap[el.menuPath].push(el.serviceCode);
            } else {
                this.complaintCategoryToItemsMap[el.menuPath] = [el.serviceCode];
            }
        });

        this.citiesMessageBundle = {
          "pb.jalandhar": {
            en_IN : "Jalandhar",
            hi_IN : "जालंधर"
          },
          "pb.amritsar": {
            en_IN : "Amritsar",
            hi_IN : "अमृतसर"
          },
          "pb.patankot": {
            en_IN : "Patankot",
            hi_IN : "पठानकोट"
          },
          "5": {
            en_IN : "Nawanshahr",
            hi_IN : "नवांशहर"
          }
        }

        this.complaintTypesMessageBundle = {
          NoStreetlight: {
            en_IN : "Please install new streetlight",
            hi_IN : "कृपया नई स्ट्रीटलाइट स्थापित करें"
          },
          StreetLightNotWorking: {
            en_IN : "Streetlight not working",
            hi_IN : "स्ट्रीटलाइट काम नहीं कर रही है"
          },
          GarbageNeedsTobeCleared: {
            en_IN : "Garbage not cleared",
            hi_IN : "स्ट्रीटलाइट काम नहीं कर रही है"
          },
          DamagedGarbageBin: {
            en_IN : "Garbage bin damaged",
            hi_IN : "कचरा बिन टूटा है"
          },
          BurningOfGarbage: {
            en_IN : "Garbage being burnt",
            hi_IN : "कचरा जलाया जा रहा है"
          },
          OverflowingOrBlockedDrain: {
            en_IN : "Drain overflow / blocked",
            hi_IN : "नाली अतिप्रवाह या अवरुद्ध है"
          },
          illegalDischargeOfSewage: {
            en_IN : "Sewage illegal discharge",
            hi_IN : "सीवेज का अवैध निर्वहन"
          },
          BlockOrOverflowingSewage: {
            en_IN : "Sewage overflow / blocked",
            hi_IN : "सीवेज अतिप्रवाह या अवरुद्ध है"
          },
          ShortageOfWater: {
            en_IN : "Water shortage",
            hi_IN : "पानी की कमी"
          },
          NoWaterSupply: {
            en_IN : "No Water supply",
            hi_IN : "पानी नहीं है"
          },
          DirtyWaterSupply: {
            en_IN : "Water supply dirty",
            hi_IN : "पानी गंदी है"
          },
          BrokenWaterPipeOrLeakage: {
            en_IN : "Pipe broken / leaking",
            hi_IN : "पानी का पाइप टूट या लीक होना"
          },
          WaterPressureisVeryLess: {
            en_IN : "Low water pressure",
            hi_IN : "कम पानी का दबाव"
          },
          DamagedRoad: {
            en_IN : "Road bad condition",
            hi_IN : "सड़क टूटी हुई है"
          },
          WaterLoggedRoad: {
            en_IN : "Road waterlogged ",
            hi_IN : "ड़क पर पानी जमा है"
          },
          ManholeCoverMissingOrDamaged: {
            en_IN : "Manhole open / cover damaged",
            hi_IN : "मैनहोल खुला है या कवर गायब है"
          },
          DamagedOrBlockedFootpath: {
            en_IN : "Footpath bad condition / blocked",
            hi_IN : "फुटपाथ टूटा या अवरुद्ध है"
          },
          ConstructionMaterialLyingOntheRoad: {
            en_IN : "Construction material lying on road",
            hi_IN : "निर्माण सामग्री सड़क पर पड़ी है"
          },
          RequestSprayingOrFoggingOperation: {
            en_IN : "Request mosquito spraying",
            hi_IN : "मच्छरों के लिए डरावना"
          },
          StrayAnimals: {
            en_IN : "Stray animal menace",
            hi_IN : "आवारा पशु खतरा"
          },
          DeadAnimals: {
            en_IN : "Dead animal. Please remove.",
            hi_IN : "मृत पशु। कृपया निकालें"
          },
          DirtyOrSmellyPublicToilets: {
            en_IN : "Toilet dirty / smelly",
            hi_IN : "टॉयलेट गंदा या बदबूदार"
          },
          PublicToiletIsDamaged: {
            en_IN : "Toilet damaged",
            hi_IN : "टॉयलेट टूट गया"
          },
          NoWaterOrElectricityinPublicToilet: {
            en_IN : "No water / electricity in Toilet",
            hi_IN : "टॉयलेट में पानी या बिजली नहीं"
          },
          IllegalShopsOnFootPath: {
            en_IN : "Illegal shops on footpath",
            hi_IN : "फुटपाथ पर अवैध दुकानें"
          },
          IllegalConstructions: {
            en_IN : "Illegal constructions",
            hi_IN : "अवैध निर्माण"
          },
          IllegalParking: {
            en_IN : "Illegal parking",
            hi_IN : "अवैध पार्किंग"
          },
          IllegalCuttingOfTrees: {
            en_IN : "Illegal tree cutting",
            hi_IN : "अवैध पेड़ की कटाई"
          },
          CuttingOrTrimmingOfTreeRequired: {
            en_IN : "Request tree trimming / cutting",
            hi_IN : "पेड़ की कटाई का अनुरोध करें"
          },
          OpenDefecation: {
            en_IN : "Open defecation",
            hi_IN : "खुले में शौच जाना"
          },
          ParkRequiresMaintenance: {
            en_IN : "Request park maintenance",
            hi_IN : "पार्क रखरखाव का अनुरोध करें"
          },
          Others: {
            en_IN : "Something else",
            hi_IN : "कुछ अन्य ..."
          },
        }

        this.complaintCategoriesMessageBundle = {
          StreetLights: {
            en_IN : "Streetlights",
            hi_IN : "सड़क की बत्तियाँ"
          },
          Garbage: {
            en_IN : "Garbage",
            hi_IN : "कचरा"
          }, 
          Drains: {
            en_IN : "Drains",
            hi_IN : "नालियों"
          },
          WaterandSewage: {
            en_IN : "Water and Sewage",
            hi_IN : "पानी और सीवेज"
          },
          RoadsAndFootpaths: {
            en_IN : "Roads and Footpaths",
            hi_IN : "सड़कें और फुटपाथ"
          },
          Mosquitos: {
            en_IN : "Mosquitos",
            hi_IN : "मच्छर"
          },
          Animals: {
            en_IN : "Animals",
            hi_IN : "जानवरों"
          },
          PublicToilets: {
            en_IN : "Public Toilets",
            hi_IN : "सार्वजनिक शौंचालय"
          },
          LandViolations: {
            en_IN : "Land violations",
            hi_IN : "भूमि का उल्लंघन"
          },
          Trees: {
            en_IN : "Trees",
            hi_IN : "पेड़"
          },
          OpenDefecation: {
            en_IN : "Open defecation",
            hi_IN : "खुले में शौच जाना"
          },
          Parks: {
            en_IN : "Parks",
            hi_IN : "पार्क"
          }
        }
    } // constructor
}
module.exports = new DummyPGRService();