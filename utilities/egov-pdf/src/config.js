// config.js
// const env = process.env.NODE_ENV; // 'dev' or 'test'

HOST = process.env.EGOV_HOST;


if (!HOST) {
    console.log("You need to set the HOST variable")
    process.exit(1)
}

module.exports = {
    auth_token: process.env.AUTH_TOKEN,
    pdf: {
        epass_pdf_template: process.env.EPASS_TEMPLATE || "tlcertificate"
    },
    app: {
      port: parseInt(process.env.APP_PORT) || 8080,
      host: HOST,
      contextPath: process.env.CONTEXT_PATH || ""
    },
    host: {
        mdms: process.env.EGOV_MDMS_HOST || HOST,
        epass: process.env.EGOV_TLSERVICES_HOST || HOST,
        pdf: process.env.EGOV_PDF_HOST || HOST,
        user: process.env.EGOV_USER_HOST || HOST,
    },
    paths: {
        pdf_create: "/pdf-service/v1/_createnosave",
        epass_search: "/tl-services/v1/_search",
        user_search: "/user/_search",
        mdms_search: "/egov-mdms-service/v1/_search",
        download_url: "download/epass"
    }
   };