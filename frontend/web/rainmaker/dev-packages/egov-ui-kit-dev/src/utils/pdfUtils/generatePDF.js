import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "egov-ui-framework/ui-redux/store";
import { appendModulePrefix } from "egov-ui-framework/ui-utils/commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { set } from "lodash";
import get from "lodash/get";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";



const vfs = { ...pdfFonts.vfs }
const font = {
    Camby: {
        normal: 'Cambay-Regular.ttf',
        bold: 'Cambay-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Cambay-Regular.ttf',

    },
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Roboto-Regular.ttf',
    }
};
pdfMake.vfs = vfs;
pdfMake.fonts = font;
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
        case 'totalAmount':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-card-sub-header",
                "border": [
                    false,
                    true,
                    false,
                    false
                ]
            }
            break;
        case 'amount':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-application-no",
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
        card.push(...newCard.stack[0].table.body);
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

        stack: [
            {
                ...getCustomCard([...card], [
                    125,
                    125,
                    125,
                    125
                ], {}, color)
            }
        ]
    }
    return tableCard;
}
const getCardWithHeader = (header, keyValue, color) => {
    let cardWithHeader = header ? [{
        "text": header == '-1' ? " " : getLocaleLabels(header, header),
        "style": header == '-1' ? "pdf-card-no-title" : "pdf-card-title"
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

export const getMultiItems = (preparedFinalObject, cardInfo, sourceArrayJsonPath) => {
    let multiItem = [];
    let removedElements = [];
    const arrayLength = get(preparedFinalObject, sourceArrayJsonPath, []).length;
    for (let i = 0; i < arrayLength; i++) {
        let items = [];
        items = generateKeyValue(preparedFinalObject, cardInfo);
        let sourceArray = get(preparedFinalObject, sourceArrayJsonPath, []);
        removedElements.push(sourceArray.shift());
        set(preparedFinalObject, sourceArrayJsonPath, sourceArray);
        multiItem.push({ items });
    }
    set(preparedFinalObject, sourceArrayJsonPath, removedElements);
    return multiItem;
}
export const getMultipleItemCard = (itemsInfo, itemHeader = "COMMON_OWNER", hideHeader = false) => {
    let multipleItems = itemsInfo[0].items.filter(item => item);
    if (itemsInfo.length > 1) {
        let items = [];
        itemsInfo.map((item, index) => {
            let rowElements = { header: `${getLocaleLabels(itemHeader, itemHeader)} - ${index+1}`, items: item.items.filter(element => element) };
            if (hideHeader) {
                delete rowElements.header;
            }
            items.push(rowElements)
        })
        multipleItems = items
    }
    return multipleItems;
}
export const getDocumentsCard = (documentsUploadRedux) => {
    return documentsUploadRedux.map(item => {
        return { key: getLocaleLabels(item.title, item.title), value: item.name }
    })
}



export const generateKeyValue = (preparedFinalObject, containerObject) => {
    let keyValue = []
    Object.keys(containerObject).map(keys => {
        const labelObject = containerObject[keys].children.label.children.key.props;
        const key = getLocaleLabels(labelObject.labelName, labelObject.labelKey)
        const valueObject = containerObject[keys].children.value.children.key.props;
        let value = valueObject.callBack && typeof valueObject.callBack == "function" ? valueObject.callBack(get(preparedFinalObject, valueObject.jsonPath, '')) : get(preparedFinalObject, valueObject.jsonPath, '');
        value = value !== 'NA' && valueObject.localePrefix ? appendModulePrefix(value, valueObject.localePrefix) : value;
        value = containerObject[keys].localiseValue ? getLocaleLabels(value, value) : value;
        keyValue.push({ key, value });
    })
    return keyValue;
}
let tableborder = {
    hLineColor: function (i, node) {
        return "#979797";
    },
    vLineColor: function (i, node) {
        return "#979797";
    },
    hLineWidth: function (i, node) {
        return 0.5;
    },
    vLineWidth: function (i, node) {
        return 0.5;
    },
};


const getCustomCard = (body = [], width = [], layout = {}, color = 'grey') => {
    return {
        "style": color == "grey" ? "pdf-table-card" : "pdf-table-card-white",
        "table": {
            widths: width,
            "body": body
        },
        "layout": layout
    }
}
const totalAmount = (arr) => {
    return arr
        .map(item => (item.value ? item.value : 0))
        .reduce((prev, next) => prev + next, 0);
}
export const getEstimateCardDetails = (fees = [], color) => {
    let estimateCard = {};

    let total = totalAmount(fees);

    let card = [];
    let row1 = []

    row1.push(getLabel(' ', 'amount'))
    row1.push(getLabel(' ', 'amount'))
    row1.push({ ...getLabel(getLocaleLabels('TL_COMMON_TOTAL_AMT', 'TL_COMMON_TOTAL_AMT'), 'amount'), "alignment": "right" })
    card.push(row1);
    let row2 = []

    row2.push(getLabel(' ', 'amount'))
    row2.push(getLabel(' ', 'amount'))
    row2.push({ ...getLabel(total, 'amount'), style: "pdf-application-no-value", "alignment": "right" })
    card.push(row2);
    let rowLast = []

    rowLast.push(getLabel(getLocaleLabels('TL_COMMON_TOTAL_AMT', 'TL_COMMON_TOTAL_AMT'), 'totalAmount'))
    rowLast.push(getLabel(total, 'totalAmount'))
    rowLast.push(getLabel(' ', 'header'))

    fees.map(fee => {
        let row = []
        row.push(getLabel(getLocaleLabels(fee.name.labelName, fee.name.labelKey), 'value'))
        row.push(getLabel(fee.value, 'value'))
        row.push(getLabel(' ', 'value'))
        card.push(row);
    })

    card.push(rowLast);

    estimateCard = getCustomCard(card, [250, 150, 108], tableborder, color)

    return estimateCard;
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
    img.src = `/ukd-assets/${tenantid}/logo.png`;
};

const getHeaderCard = (applicationData, logo) => {
    let applicationHeader = {
        style: applicationData.qrcode ? "pdf-head-qr-code" : "pdf-header",
        table: {
            widths: applicationData.qrcode ? [120, "*", 120] : [120, "*", 40],
            body: []
        },
        layout: "noBorders"
    }
    let body = [];
    body.push({
        image: logo,
        width: 60,
        height: 61.25,
        margin: [51, 12, 10, 10]
    })
    body.push({
        stack: [
            {
                text: getLocaleLabels(("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase(), ("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase()) + " " + getLocaleLabels(("CORPORATION", "CMN_ACK_CORPORATION_HEADER").toUpperCase(), ("CORPORATION", "CMN_ACK_CORPORATION_HEADER").toUpperCase()),
                style: "pdf-header-text"
            },
            {
                text: getLocaleLabels(applicationData.header, applicationData.header) || "",
                style: "pdf-header-sub-text",
            }
        ],
        alignment: "left",
        margin: [10, 13, 0, 0]
    });
    if (applicationData.qrcode) {
        body.push({
            image: applicationData.qrcode,
            width: 70,
            height: 70,
            margin: [50, 8, 8, 8],
            alignment: "right"
        })
    }

    applicationHeader.table.body.push(body)
    return applicationHeader

}
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


    let borderKey = [true, true, false, true];
    let borderValue = [false, true, true, true];
    let receiptTableWidth = ["*", "*", "*", "*"];

    data = {
        defaultStyle: {
            font: "Camby"
        },
        content: [

            { ...getHeaderCard(applicationData, logo) }
            ,
            {
                "style": "pdf-application-no",
                "columns": [
                    {
                        "text": [
                            {
                                "text": applicationData.applicationNoHeader ? getLocaleLabels(applicationData.applicationNoHeader, applicationData.applicationNoHeader) : '',
                                bold: true
                            },
                            {
                                "text": applicationData.applicationNoValue ? getLocaleLabels(applicationData.applicationNoValue, applicationData.applicationNoValue) : '',
                                italics: true,
                                "style": "pdf-application-no-value"
                            }
                        ],
                        "alignment": "left"
                    },
                    {
                        "text": [
                            {
                                "text": applicationData.additionalHeader ? getLocaleLabels(applicationData.additionalHeader, applicationData.additionalHeader) : '',
                                bold: true
                            },
                            {
                                "text": applicationData.additionalHeaderValue ? getLocaleLabels(applicationData.additionalHeaderValue, applicationData.additionalHeaderValue) : '',
                                italics: true,
                                "style": "pdf-application-no-value"
                            }
                        ],
                        "alignment": "right"
                    }
                ]
            }
        ],
        pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
            //check if signature part is completely on the last page, add pagebreak if not

            let nodeLength = followingNodesOnPage.length;
            followingNodesOnPage.map((node, ind) => {
                if (node.style == 'pdf-table-card') {
                    nodeLength = ind;
                }
            })
            if (currentNode.startPosition.verticalRatio > 0.80 && currentNode.style == 'pdf-card-title') {
                return true;
            }
            if (currentNode.startPosition.verticalRatio > 0.75 && currentNode.style == 'pdf-card-title' && nodeLength > 19) {
                return true;
            }
            return false;
        },
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
            "pdf-application-no-value": {
                "fontSize": 12,
                "font": "Roboto",
                italics: true,
                "margin": [
                    -18,
                    8,
                    0,
                    0
                ],
                "color": "#484848"
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
            "pdf-card-no-title": {
                "fontSize": 11,
                bold: true,
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
                "fontSize": 8,
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
                "fontSize": 10,
                "color": "rgba(0, 0, 0, 0.87)",
                "margin": [
                    0,
                    0,
                    0,
                    1
                ]
            },
            "pdf-head-qr-code": {
                fillColor: "#F2F2F2",
                margin: [-70, -41, -81, 0]
            },
        },
    };
    applicationData.cards.map(card => {
        switch (card.type) {
            case "singleItem":
                if (!card.hide) {
                    data.content.push(...getCardWithHeader(card.header, card.items, card.color));
                }
                break;
            case "multiItem":
                if (!card.hide) {
                    data.content.push(...getMultiItemCard(card.header, card.items, card.color));
                }
                break;
            case "estimate":
                if (!card.hide) {
                    data.content.push({ ...card.items });
                }
                break;
            default:
                if (!card.hide) {
                    data.content.push(...getCardWithHeader(card.header, card.items, card.color));
                }
        }
    })

    pdfMake.vfs = vfs;
    pdfMake.fonts = font;
    try {
        if (fileName != 'print') {
            const pdfData = pdfMake.createPdf(data);
            downloadPDFFileUsingBase64(pdfData, fileName);
        } else {
            const pdfData = pdfMake.createPdf(data);
            printPDFFileUsingBase64(pdfData, fileName);
            // data && pdfMake.createPdf(data).open();
        }
    } catch (e) {
        console.log(JSON.stringify(data), 'pdfdata');
        console.log('error in generating pdf', e);
    }

};

export const downloadPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined")
    {
      // we are running in browser
      receiptPDF.download(filename);
    } else {
      // we are running under webview
      receiptPDF.getBase64(data => {
        mSewaApp.downloadBase64File(data, filename);
      });
    }
  }
  
  export const openPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined")
    {
      // we are running in browser
      receiptPDF.open();
    } else {
      // we are running under webview
      receiptPDF.getBase64(data => {
        mSewaApp.downloadBase64File(data, filename);
      });
    }
  }
  
  export const printPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined")
    {
      // we are running in browser
      receiptPDF.print();
    } else {
      // we are running under webview
      receiptPDF.getBase64(data => {
        mSewaApp.downloadBase64File(data, filename);
      });
    }
  }

