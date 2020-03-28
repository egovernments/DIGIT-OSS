var config = require("./config")
var axios = require("axios").default;
var url = require('url')

auth_token = config.auth_token;

async function search_user(uuid, tenantId) {
    return await axios({
        method: 'post',
        url: url.resolve(config.host.user, config.paths.user_search),
        data: {
            "RequestInfo": {
                "authToken": auth_token
            },
            uuid: [uuid],
            tenantId: tenantId
        }
    });
}


async function search_epass(uuid, tenantId) {
    return await axios({
        method: 'post',
        url: url.resolve(config.host.epass, config.paths.epass_search),
        data: {
            "RequestInfo": {
                "authToken": auth_token
            }
        },
        params: {
            "tenantId": tenantId,
            "ids": uuid
        }
    });
}

async function search_mdms(tenantId, module, master) {
    return await axios({
        method: 'post',
        url: url.resolve(config.host.mdms, config.paths.mdms_search),
        data: {
            "RequestInfo": {
                "authToken": auth_token
            }
        },
        params: {
            "tenantId": tenantId,
            "ids": uuid
        }
    });
}

async function create_pdf(tenantId, key, data) {
    return await axios({
        responseType: 'stream',
        method: 'post',
        url: url.resolve(config.host.pdf, config.paths.pdf_create),
        data: Object.assign({
            "RequestInfo": {
                "authToken": auth_token,
                "userInfo": {}
            }
        }, data),
        params: {
            "tenantId": tenantId,
            "key": key
        }
    });
}

module.exports = {
    create_pdf,
    search_epass,
    search_mdms,
    search_user
}