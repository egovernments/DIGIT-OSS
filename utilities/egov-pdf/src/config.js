// config.js
// const env = process.env.NODE_ENV; // 'dev' or 'test'

HOST = process.env.EGOV_HOST;

if (!HOST) {
  console.log("You need to set the HOST variable");
  process.exit(1);
}

module.exports = {
  auth_token: process.env.AUTH_TOKEN,
  KAFKA_BROKER_HOST: process.env.KAFKA_BROKER_HOST || "kafka-v2.kafka-cluster:9092",
  KAFKA_RECEIVE_CREATE_JOB_TOPIC: process.env.KAFKA_RECEIVE_CREATE_JOB_TOPIC || "PDF_GEN_RECEIVE",
  KAFKA_BULK_PDF_TOPIC: process.env.KAFKA_BULK_PDF_TOPIC || "BULK_PDF_GEN",
  PDF_BATCH_SIZE: process.env.PDF_BATCH_SIZE || 40,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "postgres",
  DB_PORT: process.env.DB_PORT || 5432,
  pdf: {
    epass_pdf_template: process.env.EPASS_TEMPLATE || "tlcertificate",
    tlcertificate_pdf_template: process.env.TL_CERTIFICATE || "tlcertificate",
    tlrenewalcertificate_pdf_template:
      process.env.TL_RENEWALCERTIFICATE || "tlrenewalcertificate",
    tlreceipt_pdf_template: process.env.TL_RECEIPT || "tradelicense-receipt",
    tlbill_pdf_template: process.env.TL_BILL || "tradelicense-bill",
    ptreceipt_pdf_template: process.env.PT_RECEIPT || "property-receipt",
    ptmutationcertificate_pdf_template:
      process.env.PT_MUTATION_CERTIFICATE || "ptmutationcertificate",
    ptbill_pdf_template: process.env.PT_BILL || "property-bill",
    consolidated_receipt_template:
      process.env.CONSOLIDATED_RECEIPT || "consolidatedreceipt",
    consolidated_bill_template:
      process.env.CONSOLIDATED_BILL || "consolidatedbill",
    mcollect_challan_template:
      process.env.MCOLLECT_CHALLAN || "mcollect-challan",
    mcollect_bill_template:
      process.env.MCOLLECT_BILL || "mcollect-bill",
    bill_amendment_template:
      process.env.BILL_AMENDMENT || "bill-amendment-credit-note",
    wns_one_time_receipt:
    process.env.WNS_ONE_TIME_RECEIPT || "ws-onetime-receipt",
    wns_bill:
    process.env.WNS_BILL || "ws-bill",
    birth_certificate:
            process.env.BIRTH_CERTIFICATE || "birth-certificate",
    death_certificate:
        process.env.DEATH_CERTIFICATE || "death-certificate"
        
  },
  app: {
    port: parseInt(process.env.APP_PORT) || 8080,
    host: HOST,
    contextPath: process.env.CONTEXT_PATH || "/egov-pdf",
  },
  host: {
    mdms: process.env.EGOV_MDMS_HOST || HOST,
    epass: process.env.EGOV_TLSERVICES_HOST || HOST,
    tl: process.env.EGOV_TRADELICENSESERVICES_HOST || HOST,
    pt: process.env.EGOV_PTSERVICES_HOST || HOST,
    pdf: process.env.EGOV_PDF_HOST || HOST,
    user: process.env.EGOV_USER_HOST || HOST,
    payments: process.env.EGOV_PAYMENTS_HOST || HOST,
    bill: process.env.EGOV_SEARCHER_HOST || HOST,
    workflow: process.env.EGOV_WORKFLOW_HOST || HOST,
    challan: process.env.EGOV_ECHALLAN_HOST || 'http://echallan-services.egov:8080/',
    mcollectBilling: process.env.EGOV_BILLING_HOST || 'http://billing-service.egov:8080/',
    wns: process.env.EGOV_WNS_HOST || HOST
  },
  paths: {
    pdf_create: "/pdf-service/v1/_createnosave",
    epass_search: "/tl-services/v1/_search",
    tl_search: "/tl-services/v1/_search",
    pt_search: "/property-services/property/_search",
    user_search: "/user/_search",
    mdms_search: "/egov-mdms-service/v1/_search",
    download_url: "/download/epass",
    payment_search: "/collection-services/payments/$module/_search",
    bill_search: "/egov-searcher/bill-genie/billswithaddranduser/_get",
    workflow_search: "/egov-workflow-v2/egov-wf/process/_search",
    mcollect_challan_search:"/echallan-services/eChallan/v1/_search",
    mcollect_bill:"/billing-service/bill/v2/_search",
    bill_genie_getBill:"/egov-searcher/bill-genie/mcollectbills/_get",
    bill_ammendment_search: "/billing-service/amendment/_search",
    water_search: "ws-services/wc/_search",
    sewerage_search: "sw-services/swc/_search",
    searcher_water_open_search:"/egov-searcher/water-services/wateropensearch/_get",
    searcher_sewerage_open_search:"/egov-searcher/sewerage-services/sewerageopensearch/_get",
    bill_genie_waterBills:"/egov-searcher/bill-genie/waterbills/_get",
    bill_genie_sewerageBills:"/egov-searcher/bill-genie/seweragebills/_get",
    fetch_bill: "/billing-service/bill/v2/_fetchbill"
  },
};