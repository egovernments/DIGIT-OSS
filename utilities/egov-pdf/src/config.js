// config.js
// const env = process.env.NODE_ENV; // 'dev' or 'test'

HOST = process.env.EGOV_HOST;

if (!HOST) {
  console.log("You need to set the HOST variable");
  process.exit(1);
}

module.exports = {
  auth_token: process.env.AUTH_TOKEN,
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
    workflow: process.env.EGOV_WORKFLOW_HOST || HOST
  },
  paths: {
    pdf_create: "/pdf-service/v1/_createnosave",
    epass_search: "/tl-services/v1/_search",
    tl_search: "/tl-services/v1/_search",
    pt_search: "/property-services/property/_search",
    user_search: "/user/_search",
    mdms_search: "/egov-mdms-service/v1/_search",
    download_url: "/download/epass",
    payment_search: "/collection-services/payments/_search",
    bill_search: "/egov-searcher/bill-genie/billswithaddranduser/_get",
    workflow_search: "/egov-workflow-v2/egov-wf/process/_search"
  },
};