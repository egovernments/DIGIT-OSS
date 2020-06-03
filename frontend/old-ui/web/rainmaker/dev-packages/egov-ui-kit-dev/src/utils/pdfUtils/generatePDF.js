import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "egov-ui-framework/ui-redux/store";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;
pdfMake.fonts = {
    Camby: {
        normal: 'Cambay-Regular.ttf',
        bold: 'Cambay-Regular.ttf',
        italics: 'Cambay-Regular.ttf',
        bolditalics: 'Cambay-Regular.ttf'
    },

};
const getLabel = (value, type = 'key') => {
    let label = {}
    switch (type) {
        case 'key':
            label = {
                "text": value ? value : 'NA',
                "style": "pdf-card-key",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        case 'value':
            label = {
                "text": value ? value : 'NA',
                "style": "pdf-card-value",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;

        case 'header':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-card-sub-header",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        default:
            label = {
                "text": value ? value : ' ',
                "style": "pdf-card-key",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
    }

    return label;
}
const getMultiCard = (items = [], color = 'grey') => {
    let card = []

    items.map(item => {
        if (item.header) {
            let row = []
            row.push(getLabel(getLocaleLabels(item.header, item.header), 'header'))
            for (let i = 0; i < 3; i++) {
                row.push(getLabel(' ', 'header'))
            }
            card.push(row);
        }
        const newCard = getCard(item.items, color);
        card.push(...newCard.table.body);
    })

    let tableCard = {
        "style": color == "grey" ? "pdf-table-card" : "pdf-table-card-white",
        "table": {
            "widths": [
                125,
                125,
                125,
                125
            ],
            "body": [...card]
        },
        "layout": {}
    }
    return tableCard;
}
const getCard = (keyValues = [], color = 'grey') => {
    let card = []
    let keys = [];
    let values = [];
    keyValues.map(keyValue => {
        keys.push(getLabel(keyValue.key, 'key'));
        values.push(getLabel(keyValue.value, 'value'))
        if (keys.length == 4 && values.length == 4) {
            card.push([...keys]);
            card.push([...values]);
            keys = [];
            values = [];
        }
    })
    if (keys.length != 0 && values.length != 0) {
        for (let i = keys.length; i < 4; i++) {
            keys.push(getLabel(' ', 'key'));
            values.push(getLabel(' ', 'value'))
        }
        card.push([...keys]);
        card.push([...values]);
    }
    let tableCard = {
        "style": color == "grey" ? "pdf-table-card" : "pdf-table-card-white",
        "table": {
            "widths": [
                125,
                125,
                125,
                125
            ],
            "body": [...card]
        },
        "layout": {}
    }
    return tableCard;
}
const getCardWithHeader = (header, keyValue, color) => {
    let cardWithHeader = header ? [{
        "text": getLocaleLabels(header, header),
        "style": "pdf-card-title"
    }] : [];
    cardWithHeader.push(getCard(keyValue, color))
    return cardWithHeader;
}
const getMultiItemCard = (header, items, color = 'grey') => {
    let cardWithHeader = header ? [{
        "text": getLocaleLabels(header, header),
        "style": "pdf-card-title"
    }] : [];

    cardWithHeader.push(getMultiCard(items, color))


    return cardWithHeader;
}

export const loadUlbLogo = tenantid => {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        store.dispatch(
            prepareFinalObject("UlbLogoForPdf", canvas.toDataURL())

        );
        localStorage.setItem("UlbLogoForPdf", canvas.toDataURL());
        canvas = null;
    };
    img.src = `/${commonConfig.tenantId}-egov-assets/${tenantid}/logo.png`;
};
export const generatePDF = (logo, applicationData = {}, fileName) => {
    logo = logo || localStorage.getItem("UlbLogoForPdf");
    let data;
    let tableborder = {
        hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0.1;
        },
        vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0.1 : 0.1;
        },
        hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "#979797" : "#979797";
        },
        vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "#979797" : "#979797";
        },
    };

    const transform = (value, masterName) => {
        if (value) {
            return generalMDMSDataById && generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][value].code : "NA";
        } else {
            return "NA";
        }
    };

    let borderKey = [true, true, false, true];
    let borderValue = [false, true, true, true];
    let receiptTableWidth = ["*", "*", "*", "*"];

    data = {
        defaultStyle: {
            font: "Camby"
        },
        content: [
            {
                style: "pdf-header",
                table: {
                    widths: [120, "*", 40],
                    body: [
                        [
                            {
                                image: logo,
                                width: 60,
                                height: 61.25,
                                margin: [51, 12, 10, 10]
                            },
                            {
                                stack: [
                                    {
                                        text: getLocaleLabels(("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase(), ("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase()) + " " + getLocaleLabels(("CORPORATION", "PT_ACK_CORPORATION_HEADER").toUpperCase(), ("CORPORATION", "PT_ACK_CORPORATION_HEADER").toUpperCase()),
                                        style: "pdf-header-text"
                                    },
                                    {
                                        text: getLocaleLabels(applicationData.header, applicationData.header) || "",
                                        style: "pdf-header-sub-text",
                                    }
                                ],
                                alignment: "left",
                                margin: [10, 13, 0, 0]
                            }
                        ]
                    ]
                },
                layout: "noBorders"
            },
            {
                "style": "pdf-application-no",
                "columns": [
                    {
                        "text": [
                            {
                                "text": getLocaleLabels(applicationData.applicationNoHeader, applicationData.applicationNoHeader),
                                bold: true
                            },
                            {
                                "text": getLocaleLabels(applicationData.applicationNoValue, applicationData.applicationNoValue),
                                bold: false
                            }
                        ],
                        "alignment": "left"
                    },
                    {
                        "text": [
                            {
                                "text": getLocaleLabels(applicationData.additionalHeader, applicationData.additionalHeader),
                                bold: true
                            },
                            {
                                "text": getLocaleLabels(applicationData.additionalHeaderValue, applicationData.additionalHeaderValue),
                                bold: false
                            }
                        ],
                        "alignment": "right"
                    }
                ]
            }
        ],

        styles: {
            "pdf-header": {
                "fillColor": "#F2F2F2",
                "margin": [
                    -70,
                    -41,
                    -81,
                    10
                ]
            },
            "pdf-header-text": {
                "color": "#484848",
                "fontSize": 20,
                bold: true,
                "letterSpacing": 0.74,
                "margin": [
                    0,
                    0,
                    0,
                    5
                ]
            },
            "pdf-header-sub-text": {
                "color": "#484848",
                "fontSize": 15,
                "letterSpacing": 0.6
            },
            "pdf-application-no": {
                "fontSize": 12,
                bold: true,
                "margin": [
                    -18,
                    8,
                    0,
                    0
                ],
                "color": "#484848"
            },
            "pdf-card-title": {
                "fontSize": 11,
                bold: true,
                "margin": [
                    -18,
                    16,
                    8,
                    8
                ],
                "color": "#484848",
                "fontWeight": 500
            },
            "pdf-table-card-white": {
                "fillColor": "white",
                "fontSize": 7,
                "color": "#484848",
                "margin": [
                    -20,
                    -2,
                    -8,
                    -8
                ]
            },
            "pdf-table-card": {
                "fillColor": "#F2F2F2",
                "fontSize": 7,
                "color": "#484848",
                "margin": [
                    -20,
                    -2,
                    -8,
                    -8
                ]
            },
            "pdf-card-key": {
                "color": "rgba(0, 0, 0, 0.54)",
                "fontSize": 7,
                "margin": [
                    0,
                    1,
                    0,
                    0
                ]
            },
            "pdf-card-sub-header": {
                "color": "rgba(0, 0, 0, 0.94)",
                "fontSize": 9,
                bold: true,
                "margin": [
                    0,
                    3,
                    0,
                    0
                ]
            },
            "pdf-card-value": {
                "fontSize": 11,
                "color": "rgba(0, 0, 0, 0.87)",
                "margin": [
                    0,
                    0,
                    0,
                    1
                ]
            }
        },
    };
    applicationData.cards.map(card => {
        switch (card.type) {
            case "singleItem":
                data.content.push(...getCardWithHeader(card.header, card.items, card.color));
                break;
            case "multiItem":
                data.content.push(...getMultiItemCard(card.header, card.items, card.color));
                break;
            default:
                data.content.push(...getCardWithHeader(card.header, card.items, card.color));
        }
    })


    pdfMake.vfs = pdfFonts.vfs;

    try {
        if (fileName != 'print') {
            data && pdfMake.createPdf(data).download(fileName);
        } else {
            data && pdfMake.createPdf(data).print();
        }
    } catch (e) {
        console.log(JSON.stringify(data), 'pdfdata');
        console.log('error in generating pdf', e);
    }

};




