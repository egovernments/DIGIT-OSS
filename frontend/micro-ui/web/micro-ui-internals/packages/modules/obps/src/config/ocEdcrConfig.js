export const newConfig = [
    {
        head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
        body: [
            {
                route: "docs-required",
                component: "OCEDCRDocsRequired",
                key: "data",
                nextStep: "home",
            },
            {
                route: "home",
                component: "OCeDCRScrutiny",
                nextStep: "upload-diagram",
                hideInEmployee: true,
                key: "ScrutinyDetails"
            },
            {
                route: "upload-diagram",
                component: "OCUploadPlanDiagram",
                nextStep: null,
                hideInEmployee: true,
                key: "uploadData",
                texts: {
                    headerCaption: "BPA_OC_NEW_BUILDING_CONSTRUCTION_LABEL",
                    header: "BPA_UPLOAD_OC_PLAN_DIAGRAM_LABEL",
                    cardText: "",
                    submitBarLabel: "BPA_COMMON_BUTTON_SUBMIT",
                    skipText: "",
                },
            },
        ],
    }
];
