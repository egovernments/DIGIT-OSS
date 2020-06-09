const configs = {
    'DEV_URL': "http://localhost:3000/url",
    'DEMO_API_URL': "",
    'BASE_URL': '/dashboard-analytics',
    'UPLOAD_URL': '',
    'POWERED_BY': 'Tarento',
    'APP_NAME': '/dashboard/',
    'FILE_UPLOAD':'/filestore/v1/files',
    'FETCH_FILE':'/filestore/v1/files/url',
    'MDMS': '/egov-mdms-service/v1/_search',
    'SHORTEN_URL':'/egov-url-shortening/shortener',
    'DOC_EXTENSION':['_small','_medium','_large'],
    'CHART_COLOR_CODE':["#35a2eb", "#f19c56", "#4c76c7", "#ff6384", '#FFC107', '#009688', '#9C27B0', '#4CAF50',"#99d4fa", "#179cf4", "#1d9cf4", "#1sacq4", "#1gvcf4"],
    'MODULE_LEVEL':[
                    {'dashboard':null},
                    {'propertytax':{'services_name':'Property Tax','filterKey':'PT'}},
                    {'tradelicense':{'services_name':'Trade licence','filterKey':'TL'}},
                    {'pgr':{'services_name':'PGR','filterKey':'PGR'}},
                    {'ws':{'services_name':'W&S','filterKey':'W&S'}}
                    ],
    'SERVICES': ["Property Tax", "Trade licence","PGR"]
}
export default configs;
