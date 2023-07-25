import commonConfig from "config/common.js";
import "datatables";
import "datatables-buttons";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons-bs";
import "datatables.net-buttons/js/buttons.colVis.min.js";
import "datatables.net-buttons/js/buttons.flash.js"; // Flash file export
import "datatables.net-buttons/js/buttons.html5.js"; // HTML 5 file export
import "datatables.net-dt";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { commonApiPost } from "egov-ui-kit/utils/api";
import { getTenantId, localStorageSet, setReturnUrl } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import $ from "jquery";
import JSZip from "jszip/dist/jszip";
import _ from "lodash";
import get from "lodash/get";
import RaisedButton from "material-ui/RaisedButton";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getResultUrl, translate } from "./commons";
import "./index.css";
import { downloadPDFFileUsingBase64 } from "./pdfUtils/generatePDF";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = JSZip;

var sumColumn = [];
var footerexist = false;
let rTable;
const mobileCheck = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
const formatLocaleKeys = (key = "") => {
  if (typeof key != "string") {
    return key;
  }
  key = (key.trim && key.trim()) || key;
  key = (key.toUpperCase && key.toUpperCase()) || key;
  key = key.replace(/[.:-\s\/]/g, "_") || key;
  return key;
};

// Excel - Pre-defined strings to build a basic XLSX file
var excelStrings = {
  "_rels/.rels":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
    "</Relationships>",

  "xl/_rels/workbook.xml.rels":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    "</Relationships>",

  "[Content_Types].xml":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="xml" ContentType="application/xml" />' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />' +
    '<Default Extension="jpeg" ContentType="image/jpeg" />' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />' +
    '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />' +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />' +
    "</Types>",

  "xl/workbook.xml":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>' +
    '<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>' +
    "<bookViews>" +
    '<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>' +
    "</bookViews>" +
    "<sheets>" +
    '<sheet name="Sheet1" sheetId="1" r:id="rId1"/>' +
    "</sheets>" +
    "<definedNames/>" +
    "</workbook>",

  "xl/worksheets/sheet1.xml":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' +
    "<sheetData/>" +
    '<mergeCells count="0"/>' +
    "</worksheet>",

  "xl/styles.xml":
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' +
    '<numFmts count="6">' +
    '<numFmt numFmtId="164" formatCode="#,##0.00_- [$$-45C]"/>' +
    '<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>' +
    '<numFmt numFmtId="166" formatCode="[$€-2] #,##0.00"/>' +
    '<numFmt numFmtId="167" formatCode="0.0%"/>' +
    '<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>' +
    '<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>' +
    "</numFmts>" +
    '<fonts count="5" x14ac:knownFonts="1">' +
    "<font>" +
    '<sz val="11" />' +
    '<name val="Calibri" />' +
    "</font>" +
    "<font>" +
    '<sz val="11" />' +
    '<name val="Calibri" />' +
    '<color rgb="FFFFFFFF" />' +
    "</font>" +
    "<font>" +
    '<sz val="11" />' +
    '<name val="Calibri" />' +
    "<b />" +
    "</font>" +
    "<font>" +
    '<sz val="11" />' +
    '<name val="Calibri" />' +
    "<i />" +
    "</font>" +
    "<font>" +
    '<sz val="11" />' +
    '<name val="Calibri" />' +
    "<u />" +
    "</font>" +
    "</fonts>" +
    '<fills count="6">' +
    "<fill>" +
    '<patternFill patternType="none" />' +
    "</fill>" +
    "<fill>" + // Excel appears to use this as a dotted background regardless of values but
    '<patternFill patternType="none" />' + // to be valid to the schema, use a patternFill
    "</fill>" +
    "<fill>" +
    '<patternFill patternType="solid">' +
    '<fgColor rgb="FFD9D9D9" />' +
    '<bgColor indexed="64" />' +
    "</patternFill>" +
    "</fill>" +
    "<fill>" +
    '<patternFill patternType="solid">' +
    '<fgColor rgb="FFD99795" />' +
    '<bgColor indexed="64" />' +
    "</patternFill>" +
    "</fill>" +
    "<fill>" +
    '<patternFill patternType="solid">' +
    '<fgColor rgb="ffc6efce" />' +
    '<bgColor indexed="64" />' +
    "</patternFill>" +
    "</fill>" +
    "<fill>" +
    '<patternFill patternType="solid">' +
    '<fgColor rgb="ffc6cfef" />' +
    '<bgColor indexed="64" />' +
    "</patternFill>" +
    "</fill>" +
    "</fills>" +
    '<borders count="2">' +
    "<border>" +
    "<left />" +
    "<right />" +
    "<top />" +
    "<bottom />" +
    "<diagonal />" +
    "</border>" +
    '<border diagonalUp="false" diagonalDown="false">' +
    '<left style="thin">' +
    '<color auto="1" />' +
    "</left>" +
    '<right style="thin">' +
    '<color auto="1" />' +
    "</right>" +
    '<top style="thin">' +
    '<color auto="1" />' +
    "</top>" +
    '<bottom style="thin">' +
    '<color auto="1" />' +
    "</bottom>" +
    "<diagonal />" +
    "</border>" +
    "</borders>" +
    '<cellStyleXfs count="1">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />' +
    "</cellStyleXfs>" +
    '<cellXfs count="68">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
    '<alignment horizontal="left"/>' +
    "</xf>" +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
    '<alignment horizontal="center"/>' +
    "</xf>" +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
    '<alignment horizontal="right"/>' +
    "</xf>" +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
    '<alignment horizontal="fill"/>' +
    "</xf>" +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
    '<alignment textRotation="90"/>' +
    "</xf>" +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
    '<alignment wrapText="1"/>' +
    "</xf>" +
    '<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="14" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
    "</cellXfs>" +
    '<cellStyles count="1">' +
    '<cellStyle name="Normal" xfId="0" builtinId="0" />' +
    "</cellStyles>" +
    '<dxfs count="0" />' +
    '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />' +
    "</styleSheet>",
};
// Note we could use 3 `for` loops for the styles, but when gzipped there is
// virtually no difference in size, since the above can be easily compressed

// Pattern matching for special number formats. Perhaps this should be exposed
// via an API in future?
// Ref: section 3.8.30 - built in formatters in open spreadsheet
//   https://www.ecma-international.org/news/TC45_current_work/Office%20Open%20XML%20Part%204%20-%20Markup%20Language%20Reference.pdf
var _excelSpecials = [
  {
    match: /^\-?\d+\.\d%$/,
    style: 60,
    fmt: function (d) {
      return d / 100;
    },
  }, // Percent with d.p.
  {
    match: /^\-?\d+\.?\d*%$/,
    style: 56,
    fmt: function (d) {
      return d / 100;
    },
  }, // Percent
  { match: /^\-?\$[\d,]+.?\d*$/, style: 57 }, // Dollars
  { match: /^\-?£[\d,]+.?\d*$/, style: 58 }, // Pounds
  { match: /^\-?€[\d,]+.?\d*$/, style: 59 }, // Euros
  { match: /^\-?\d+$/, style: 65 }, // Numbers without thousand separators
  { match: /^\-?\d+\.\d{2}$/, style: 66 }, // Numbers 2 d.p. without thousands separators
  {
    match: /^\([\d,]+\)$/,
    style: 61,
    fmt: function (d) {
      return -1 * d.replace(/[\(\)]/g, "");
    },
  }, // Negative numbers indicated by brackets
  {
    match: /^\([\d,]+\.\d{2}\)$/,
    style: 62,
    fmt: function (d) {
      return -1 * d.replace(/[\(\)]/g, "");
    },
  }, // Negative numbers indicated by brackets - 2d.p.
  { match: /^\-?[\d,]+$/, style: 63 }, // Numbers with thousand separators
  { match: /^\-?[\d,]+\.\d{2}$/, style: 64 },
  {
    match: /^[\d]{4}\-[\d]{2}\-[\d]{2}$/,
    style: 67,
    fmt: function (d) {
      return Math.round(25569 + Date.parse(d) / (86400 * 1000));
    },
  }, //Date yyyy-mm-dd
];

var _ieExcel;
var _serialiser = new XMLSerializer();
function _addToZip(zip, obj) {
  if (_ieExcel === undefined) {
    // Detect if we are dealing with IE's _awful_ serialiser by seeing if it
    // drop attributes
    _ieExcel =
      _serialiser
        .serializeToString(new window.DOMParser().parseFromString(excelStrings["xl/worksheets/sheet1.xml"], "text/xml"))
        .indexOf("xmlns:r") === -1;
  }

  $.each(obj, function (name, val) {
    if ($.isPlainObject(val)) {
      var newDir = zip.folder(name);
      _addToZip(newDir, val);
    } else {
      if (_ieExcel) {
        // IE's XML serialiser will drop some name space attributes from
        // from the root node, so we need to save them. Do this by
        // replacing the namespace nodes with a regular attribute that
        // we convert back when serialised. Edge does not have this
        // issue
        var worksheet = val.childNodes[0];
        var i, ien;
        var attrs = [];

        for (i = worksheet.attributes.length - 1; i >= 0; i--) {
          var attrName = worksheet.attributes[i].nodeName;
          var attrValue = worksheet.attributes[i].nodeValue;

          if (attrName.indexOf(":") !== -1) {
            attrs.push({ name: attrName, value: attrValue });

            worksheet.removeAttribute(attrName);
          }
        }

        for (i = 0, ien = attrs.length; i < ien; i++) {
          var attr = val.createAttribute(attrs[i].name.replace(":", "_dt_b_namespace_token_"));
          attr.value = attrs[i].value;
          worksheet.setAttributeNode(attr);
        }
      }

      var str = _serialiser.serializeToString(val);

      // Fix IE's XML
      if (_ieExcel) {
        // IE doesn't include the XML declaration
        if (str.indexOf("<?xml") === -1) {
          str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + str;
        }

        // Return namespace attributes to being as such
        str = str.replace(/_dt_b_namespace_token_/g, ":");

        // Remove testing name space that IE puts into the space preserve attr
        str = str.replace(/xmlns:NS[\d]+="" NS[\d]+:/g, "");
      }

      // Safari, IE and Edge will put empty name space attributes onto
      // various elements making them useless. This strips them out
      str = str.replace(/<([^<>]*?) xmlns=""([^<>]*?)>/g, "<$1 $2>");

      zip.file(name, str);
    }
  });
}

class ShowField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ck: {},
      rows: {},
      showPrintBtn: false,
    };
  }

  componentWillUnmount() {
    $("#reportTable").DataTable().destroy(true);
  }

  componentWillUpdate() {
    let { flag } = this.props;
    if (flag == 1) {
      flag = 0;
      $("#reportTable").dataTable().fnDestroy();
    }
  }

  componentDidMount() {
    let _this = this;
    _this.setState({
      reportName: _this.props.match.params.reportName,
      moduleName: _this.props.match.params.moduleName,
    });
    _this.subHeader(_this.props.match.params.moduleName);
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      reportName: nextprops.match.params.reportName,
      moduleName: nextprops.match.params.moduleName,
      ck: {},
    });
    this.subHeader(nextprops.match.params.moduleName);
    // }
  }

  getExportOptions = () => {
    let _this = this;

    for (let key in _this.state.ck) {
      if (_this.state.ck[key]) {
        break;
      }
    }

    const { tabLabel, metaData } = _this.props;
    const reportDetails = metaData.hasOwnProperty("reportDetails") ? metaData.reportDetails : {};
    const additionalConfig = reportDetails.hasOwnProperty("additionalConfig") && reportDetails.additionalConfig ? reportDetails.additionalConfig : {};
    const reportHeader = reportDetails.hasOwnProperty("reportHeader") ? reportDetails.reportHeader : [];
    const pageSize = additionalConfig.print && additionalConfig.print.pdfPageSize ? additionalConfig.print.pdfPageSize : "LEGAL";
    let reportTitle = this.getReportTitle();
    let xlsTitle = this.getXlsReportTitle();
    let orientation = reportHeader.length > 6 ? "landscape" : "portrait";

    const buttons = [
      {
        text: `<span style="color:#767676">${getLocaleLabels("RT_DOWNLOAD_AS", "RT_DOWNLOAD_AS")}</span>`,
        className: "report-download-button-text",
      },
      {
        extend: "pdf",
        filename: _this.state.reportName,
        messageTop: tabLabel,
        text: getLocaleLabels("RT_DOWNLOAD_PDF", "RT_DOWNLOAD_PDF"),
        orientation: orientation,
        pageSize: pageSize,
        footer: true,
        customize: function (doc) {
          doc.content[0].text = [];
          doc.content[0].text.push({ text: "mSeva System Reports\n\n", bold: true, fontSize: 20 });
          doc.content[0].text.push({ text: reportTitle, fontSize: 18 });
          if (doc.content[1] && !doc.content[2]) {
            doc.content[1].margin = reportHeader.length > 6 ? null : reportHeader.length < 3 ? [180, 10, 10, 12] : [60, 10, 10, 12];
          } else if (doc.content[1] && doc.content[2]) {
            doc.content[1].margin = reportHeader.length > 6 ? [380, 10, 10, 12] : [180, 10, 10, 12];
            doc.content[2].margin = reportHeader.length > 6 ? null : reportHeader.length < 3 ? [180, 10, 10, 12] : [60, 10, 10, 12];
          }

          // for PDF alignment issues
          if (
            doc &&
            doc.content &&
            doc.content.length &&
            doc.content[2] &&
            doc.content[2].table &&
            doc.content[2].table.body &&
            doc.content[2].table.body.length &&
            doc.content[2].table.body[0] &&
            doc.content[2].table.body[0].length &&
            doc.content[2].table.body[0].length > 6
          ) {
            let bodyDataLength = doc.content[2].table.body[0].length;
            let dataLengthPer = `${100 / bodyDataLength}%`;
            doc.defaultStyle.alignment = "center";
            doc.styles.tableHeader.alignment = "center";
            doc.content[2].table.widths = Array(doc.content[2].table.body[0].length + 1)
              .join(`${dataLengthPer}?`)
              .split("?");
          }

          if (window && window.mSewaApp && window.mSewaApp.isMsewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
            const pdfData = pdfMake.createPdf(doc);
            downloadPDFFileUsingBase64(pdfData, `${_this.state.reportName}.pdf`);
            return;
          }
        },
        className: "report-pdf-button",
      },
      {
        extend: "excel",
        text: getLocaleLabels("RT_DOWNLOAD_XLS", "RT_DOWNLOAD_XLS"),
        filename: _this.state.reportName,
        title: xlsTitle,
        messageTop: tabLabel,
        footer: true,
        customize: function (doc) {
          if (window && window.mSewaApp && window.mSewaApp.isMsewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
            var zip = new JSZip();
            var zipConfig = {
              type: "blob",
              mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            _addToZip(zip, doc);
            zip.generateAsync(zipConfig).then(function (blob) {
              downloadPDFFileUsingBase64(blob, `${_this.state.reportName}.xlsx`);
            });
            return;
          }
        },
        className: "report-excel-button",
      },
    ];
    return buttons;
  };

  componentDidUpdate() {
    let { tabLabel, metaData } = this.props;
    let { reportDetails = {} } = metaData;
    let tableConfig;
    if (get(reportDetails, "additionalConfig.tableConfig")) {
      tableConfig = reportDetails.additionalConfig.tableConfig;
    }
    let self = this;
    let displayStart = 0;
    if (rTable && rTable.page && rTable.page.info()) {
      displayStart = rTable.page.info().start;
    }
    let showTabLabel = () => {
      $(".report-result-table-header").html(`${tabLabel}`);
    };
    rTable = $("#reportTable").DataTable({
      dom: "<'&nbsp''row'<'col-sm-2 col-xs-12 text-center unique-jk-report-btns'l><'col-sm-4 col-xs-12 text-center unique-jk-report-btns'f><'col-sm-6 col-xs-12 text-center unique-jk-report-btns'B>><'row margin0'<'col-sm-12 unique-jk-report-btns't>><'&nbsp''row'<'col-sm-5 col-xs-12'i><'col-sm-7 col-xs-12'p>>",
      displayStart: displayStart,
      buttons: self.getExportOptions(),
      searching: true,
      language: {
        sLengthMenu: `${getLocaleLabels("CS_SHOW", "CS_SHOW")} _MENU_ ${getLocaleLabels("CS_ENTRIES", "CS_ENTRIES")}`,
        sSearch: getLocaleLabels("CS_SEARCH", "CS_SEARCH"),
        sInfo: `${getLocaleLabels("CS_SHOWING", "CS_SHOWING")} _START_ ${getLocaleLabels("CS_TO", "CS_TO")} _END_ ${getLocaleLabels(
          "CS_OF",
          "CS_OF"
        )} _TOTAL_ ${getLocaleLabels("CS_RECORDS", "CS_RECORDS")}`,
        oPaginate: {
          sFirst: getLocaleLabels("CS_PAGINATION_FIRST", "CS_PAGINATION_FIRST"),
          sLast: getLocaleLabels("CS_PAGINATION_LAST", "CS_PAGINATION_LAST"),
          sNext: getLocaleLabels("CS_PAGINATION_NEXT", "CS_PAGINATION_NEXT"),
          sPrevious: getLocaleLabels("CS_PAGINATION_PREVIOUS", "CS_PAGINATION_PREVIOUS"),
        },
      },
      paging: true,
      ordering: true,
      columnDefs: [
        {
          ordering: false,
          targets: 0,
        },
      ],

      orderCellsTop: true,
      fixedHeader: true,
      responsive: true,
      fixedColumns: true,
      scrollY: 400,
      aLengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "All"],
      ],
      scrollX: true,
      fnInitComplete: function () {
        this.css("visibility", "visible");

        $(".dataTables_scrollBody thead tr").css({ visibility: "collapse" });
      },
      drawCallback: function (settings) {
        $(".dataTables_scrollBody thead tr").css({ visibility: "collapse" });
      },
      ...tableConfig,
    });
    showTabLabel();
  }

  drillDown = (e, i, i2, item, item1) => {
    let { reportResult, searchForm, setReportResult, setFlag, searchParams, setRoute, match, pushReportHistory } = this.props;
    let object = reportResult.reportHeader[i2];
    let copySearchParams = _.clone(searchParams);

    if (object.defaultValue && object.defaultValue.search("_parent") > -1) {
      let splitArray = object.defaultValue.split("&");

      for (var i = 1; i < splitArray.length; i++) {
        let key, value;
        if (splitArray[i].search("{") > -1) {
          key = splitArray[i].split("=")[0];
          let inputparam = splitArray[i].split("{")[1].split("}")[0];
          for (var j = 0; j < reportResult.reportHeader.length; j++) {
            if (reportResult.reportHeader[j].name == inputparam) {
              value = item[j];
            }
          }
        } else {
          key = splitArray[i].split("=")[0];
          if (key == "status") {
            value = splitArray[i].split("=")[1].toUpperCase();
          } else {
            value = splitArray[i].split("=")[1];
          }
        }
        searchParams.push({ name: key, input: value });
      }

      var tenantId = getTenantId() ? getTenantId() : commonConfig.tenantId;

      commonApiPost(
        "/report/" + "pgr" + "/_get",
        {},
        {
          tenantId: tenantId,
          reportName: splitArray[0].split("=")[1],
          searchParams,
        }
      ).then(
        function (response) {
          if (response && response.reportHeader && response.reportData) {
            let hiddenRows = [];
            response.reportHeader.map((e, i) => {
              if (!e.showColumn) {
                hiddenRows.push(i);
              }
            });
            response.reportHeader = response.reportHeader.filter((e) => e.showColumn);
            response.reportData = response.reportData.map((ele) =>
              ele.filter((e, i) => !hiddenRows.includes(i)).map((ele) => (ele == null ? "" : ele))
            );
          }

          if (response.viewPath && response.reportData && response.reportData[0]) {
            localStorage.reportData = JSON.stringify(response.reportData);
            setReturnUrl(window.location.hash.split("#/")[1]);
            localStorageSet("moduleName", match.params.moduleName);
            localStorageSet(
              "searchCriteria",
              JSON.stringify({
                tenantId: tenantId,
                reportName: match.params.reportName,
                searchParams: copySearchParams,
              })
            );
            localStorageSet("searchForm", JSON.stringify(searchForm));
            setRoute("/print/report/" + response.viewPath);
          } else {
            pushReportHistory({
              tenantId: tenantId,
              reportName: splitArray[0].split("=")[1],
              searchParams,
            });
            setReportResult(response);
            setFlag(1);
          }
        },
        function (err) {}
      );
    } else if (object.defaultValue && object.defaultValue.search("_url") > -1) {
      let afterURL = object.defaultValue.split("?")[1];
      let URLparams = afterURL.split(":");
      if (URLparams.length > 1) {
        setRoute(`${URLparams[0] + encodeURIComponent(item1)}`);
      } else {
        setRoute(URLparams[0]);
      }
    }
  };

  addCommas = (num) => {
    if (isNaN(num)) {
      return num;
    }
    let value = num.toString().trim();
    const decLoc = value.indexOf(".") > -1 ? value.indexOf(".") : value.length;
    let i = decLoc - 3;
    if (i >= 1 && value.charAt(i - 1) !== "-") {
      value = value.substr(0, i) + "," + value.substr(i, value.length);
      i -= 2;
      while (i >= 1) {
        if (value.charAt(i - 1) == "-")
          // Handle for negatives
          break;
        value = value.substr(0, i) + "," + value.substr(i, value.length);
        i -= 2;
      }
    }
    return value;
  };

  checkIfDate = (val, i) => {
    let { reportResult, metaData } = this.props;
    let showCustomColorColumn = false;
    /*
    Custom Logic for TL Pending report to show red color column
    */
    if (metaData && metaData.reportDetails && metaData.reportDetails.reportName && metaData.reportDetails.reportName == "TLRenewalPendingReport") {
      if (
        reportResult &&
        reportResult.reportHeader &&
        reportResult.reportHeader.length &&
        reportResult.reportHeader[i] &&
        reportResult.reportHeader[i].name == "elapsedtime"
      ) {
        showCustomColorColumn = true;
      }
    }

    if (
      reportResult &&
      reportResult.reportHeader &&
      reportResult.reportHeader.length &&
      reportResult.reportHeader[i] &&
      reportResult.reportHeader[i].type == "epoch"
    ) {
      var _date = new Date(Number(val));
      return ("0" + _date.getDate()).slice(-2) + "/" + ("0" + (_date.getMonth() + 1)).slice(-2) + "/" + _date.getFullYear();
    } else {
      if (
        reportResult &&
        reportResult.reportHeader &&
        reportResult.reportHeader.length &&
        reportResult.reportHeader[i] &&
        (reportResult.reportHeader[i].type == "currency" || reportResult.reportHeader[i].total)
      ) {
        return this.addCommas(Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(2));
      } else if (
        val &&
        reportResult &&
        reportResult.reportHeader &&
        reportResult.reportHeader.length &&
        reportResult.reportHeader[i] &&
        reportResult.reportHeader[i].isLocalisationRequired 
      ) {
        if (reportResult.reportHeader[i].localisationPrefix == "ACCESSCONTROL_ROLES_ROLES_") {
          let list = val && val.split(",");
          return list.map((v1) => (
            <Label
              className="report-header-row-label"
              labelStyle={{ wordWrap: "unset", wordBreak: "unset" }}
              label={`${reportResult.reportHeader[i].localisationPrefix}${formatLocaleKeys(v1) || v1}`}
            />
          ));
        }
        return (
          <Label
            className="report-header-row-label"
            labelStyle={{ wordWrap: "unset", wordBreak: "unset" }}
            label={`${reportResult.reportHeader[i].localisationPrefix}${formatLocaleKeys(val)}`}
          />
        );
      } else {
        if (
          reportResult &&
          reportResult.reportHeader &&
          reportResult.reportHeader.length &&
          reportResult.reportHeader[i] &&
          reportResult.reportHeader[i].type == "number"
        ) {
          if (val) {
            return showCustomColorColumn && Number(val) > 7 ? <span style={{ color: "red" }}>{val}</span> : val;
          }
          return " - ";
        }

        return val ? val : getLocaleLabels("COMMON_NA", "COMMON_NA");
      }
    }
  };

  checkAllRows = (e) => {
    let { reportResult } = this.props;
    let ck = { ...this.state.ck };
    let rows = { ...this.state.rows };
    let showPrintBtn = true;

    if (reportResult && reportResult.reportData && reportResult.reportData.length) {
      if (e.target.checked)
        for (let i = 0; i < reportResult.reportData.length; i++) {
          ck[i] = true;
          rows[i] = reportResult.reportData[i];
        }
      else {
        ck = {};
        rows = {};
        showPrintBtn = false;
      }

      this.setState({
        ck,
        rows,
        showPrintBtn,
      });
    }
  };

  renderHeader = () => {
    let { reportResult, metaData } = this.props;
    let { checkAllRows } = this;
    return (
      <thead>
        <tr className="report-table-header">
          <th key={"S. No."} className="report-header-cell">
            <Label className="report-header-row-label" labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }} label={"RT_SNO"} />
          </th>
          {metaData && metaData.reportDetails && metaData.reportDetails.selectiveDownload && (
            <th key={"testKey"}>
              <input type="checkbox" onChange={checkAllRows} />
            </th>
          )}
          {reportResult.hasOwnProperty("reportHeader") &&
            reportResult.reportHeader.map((item, i) => {
              if (item.showColumn) {
                return (
                  <th key={i} className="report-header-cell">
                    <Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }}
                      label={item.label}
                    />
                  </th>
                );
              } else {
                return (
                  <th style={{ display: "none" }} key={i}>
                    <Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }}
                      label={item.label}
                    />
                  </th>
                );
              }
            })}
        </tr>
      </thead>
    );
  };

  printSelectedDetails() {
    let rows = { ...this.state.rows };
    let { reportResult, searchParams, setRoute, match } = this.props;
    let header = this.props.reportResult.reportHeader;
    let defaultValue = "";
    for (let key in header) {
      if (header[key].defaultValue && header[key].defaultValue.search("_parent") > -1) {
        defaultValue = header[key].defaultValue;
      }
    }

    if (defaultValue) {
      let splitArray = defaultValue.split("&");
      let values = [],
        key;
      for (var k in rows) {
        for (var i = 1; i < splitArray.length; i++) {
          let value;
          if (splitArray[i].search("{") > -1) {
            key = splitArray[i].split("=")[0];
            let inputparam = splitArray[i].split("{")[1].split("}")[0];
            for (var j = 0; j < reportResult.reportHeader.length; j++) {
              if (reportResult.reportHeader[j].name == inputparam) {
                value = rows[k][j];
              }
            }
          } else {
            key = splitArray[i].split("=")[0];
            if (key == "status") {
              value = splitArray[i].split("=")[1].toUpperCase();
            } else {
              value = splitArray[i].split("=")[1];
            }
          }
          values.push(value);
        }
      }

      searchParams.push({ name: key, input: values });
      let resulturl = getResultUrl(match.params.moduleName);

      var tenantId = getTenantId() ? getTenantId() : commonConfig.tenantId;
      resulturl &&
        commonApiPost(
          resulturl,
          {},
          {
            tenantId: tenantId,
            reportName: splitArray[0].split("=")[1],
            searchParams,
          }
        ).then(
          function (response) {
            if (response && response.reportHeader && response.reportData) {
              let hiddenRows = [];
              response.reportHeader.map((e, i) => {
                if (!e.showColumn) {
                  hiddenRows.push(i);
                }
              });
              response.reportHeader = response.reportHeader.filter((e) => e.showColumn);
              response.reportData = response.reportData.map((ele) =>
                ele.filter((e, i) => !hiddenRows.includes(i)).map((ele) => (ele == null ? "" : ele))
              );
            }

            if (response.viewPath && response.reportData) {
              localStorage.reportData = JSON.stringify(response.reportData);
              setReturnUrl(window.location.hash.split("#/")[1]);
              setRoute("/print/report/" + response.viewPath);
            }
          },
          function (err) {
            console.log(err, "error");
          }
        );
    }
  }

  getStyleForCell = (i) => {
    let { reportResult } = this.props;
    if (
      reportResult &&
      reportResult.reportHeader &&
      reportResult.reportHeader.length &&
      reportResult.reportHeader[i] &&
      (reportResult.reportHeader[i].type == "currency" || reportResult.reportHeader[i].total)
    ) {
      return { textAlign: "right" };
    } else {
      return { textAlign: "left" };
    }
  };

  renderBody = () => {
    sumColumn = [];
    let { reportResult, metaData } = this.props;
    let { drillDown, checkIfDate } = this;
    // let elapsedTimeValue = [];
    // let localityIndex = "";

    // let metaDataResults = metaData && metaData.reportDetails && metaData.reportDetails.reportHeader;
    // if (metaDataResults && metaDataResults.length > 0) {
    //   localityIndex = metaDataResults.findIndex(checkLocality);
    //   function checkLocality(column) {
    //     return column && column.label && column.label.includes("locality");
    //   }
    // }

    // if (
    //   metaData &&
    //   metaData.reportDetails &&
    //   metaData.reportDetails.reportName == "TLRenewalPendingReport"  ) {
    //     reportResult.reportHeader.forEach((data, index) => data.index = index);
    //     elapsedTimeValue = reportResult.reportHeader.filter((data, index) => data.name == "elapsedtime" && index);
    //   }
    // let reportResultArray = [];
    // if(reportResult && reportResult.reportData && reportResult.reportData.length) {
    //   reportResult.reportData.forEach(data => {
    //     let reportDataArray = [];
    //     data.forEach((details, index) => {
    //       if(details == null || details == undefined || details == "") {
    //         reportDataArray.push("NA")
    //       } else {
    //         if ((details && typeof details == "string") || (details && typeof details == "string" && details.includes("_"))) {
    //           if (localityIndex !== index) {
    //             let localisedData = getLocaleLabels(details, details);
    //             reportDataArray.push(localisedData);
    //           } else {
    //             reportDataArray.push(details)
    //           }
    //         } else {
    //           if ( metaData &&
    //             metaData.reportDetails &&
    //             metaData.reportDetails.reportName == "TLRenewalPendingReport" && elapsedTimeValue && elapsedTimeValue[0].index == index && Number(details) > 7) {
    //               reportDataArray.push(<span style={{color: "red"}}>{details}</span>)
    //           } else {
    //             reportDataArray.push(details)
    //           }

    //         }
    //       }
    //     })
    //     reportResultArray.push(reportDataArray);
    //   })
    // }

    return (
      <tbody>
        {reportResult.hasOwnProperty("reportData") &&
          reportResult.reportData.map((dataItem, dataIndex) => {
            //array of array
            let reportHeaderObj = reportResult.reportHeader;
            return (
              <tr
                key={dataIndex}
                className={this.state.ck[dataIndex] ? "selected" : ""}
                style={mobileCheck() ? { width: "100%", display: "flex" } : {}}
              >
                <td>{dataIndex + 1}</td>
                {metaData && metaData.reportDetails && metaData.reportDetails.selectiveDownload && (
                  <td>
                    <input
                      type="checkbox"
                      checked={this.state.ck[dataIndex] ? true : false}
                      onClick={(e) => {
                        let ck = { ...this.state.ck };
                        ck[dataIndex] = e.target.checked;
                        let rows = this.state.rows;
                        if (e.target.checked) {
                          rows[dataIndex] = dataItem;
                        } else {
                          delete rows[dataIndex];
                        }

                        let showPrintBtn;
                        if (Object.keys(rows).length) showPrintBtn = true;
                        else showPrintBtn = false;
                        this.setState({
                          ck,
                          rows,
                          showPrintBtn,
                        });
                      }}
                    />
                  </td>
                )}
                {dataItem.map((item, itemIndex) => {
                  //array for particular row
                  var respHeader = reportHeaderObj[itemIndex];
                  if (respHeader.showColumn) {
                    return (
                      <td
                        key={itemIndex}
                        style={this.getStyleForCell(itemIndex)}
                        onClick={(e) => {
                          drillDown(e, dataIndex, itemIndex, dataItem, item);
                        }}
                      >
                        {respHeader.defaultValue ? <a href="javascript:void(0)">{checkIfDate(item, itemIndex)}</a> : checkIfDate(item, itemIndex)}
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={itemIndex}
                        onClick={(e) => {
                          drillDown(e, dataIndex, itemIndex, dataItem, item);
                        }}
                      >
                        {respHeader.defaultValue ? <a href="javascript:void(0)">{checkIfDate(item, itemIndex)}</a> : checkIfDate(item, itemIndex)}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
      </tbody>
    );
  };

  renderFooter = () => {
    let { reportResult, metaData } = this.props;
    let reportHeaderObj = reportResult.reportHeader;
    if (reportResult && reportResult.reportData && reportResult.reportData.length > 0) {
      footerexist = true;
    } else {
      footerexist = false;
    }
    {
      reportHeaderObj.map((headerObj, index) => {
        let columnObj = {};
        if (headerObj.showColumn) {
          columnObj["showColumn"] = headerObj.showColumn;
          columnObj["total"] = null == headerObj.total ? false : headerObj.total;
          sumColumn.push(columnObj);
        }
      });
      //for 1st column (Sr.No)
      let firstColObj = {};
      firstColObj["total"] = false;
      sumColumn.unshift(firstColObj);
    }

    var intVal = function (i) {
      if (typeof i === "string") {
        let a = i.replace(/,/g, "");
        a = a.replace(/[^-+0-9. ]/g, " ").split(" ")[0];
        let inta = a && Number(a);
        return inta;
      } else if (typeof i === "number") {
        return i;
      }
    };

    let total = [];
    for (let i = 0; i < reportResult.reportData.length; i++) {
      for (let j = 0; j < reportResult.reportData[i].length; j++) {
        let val = intVal(reportResult.reportData[i][j]);
        if (i == 0) {
          if (sumColumn[j + 1] && sumColumn[j + 1].total && typeof val === "number") {
            total.push(val);
          } else {
            total.push("");
          }
          continue;
        }
        if (sumColumn[j + 1] && sumColumn[j + 1].total) {
          if (typeof val === "number") {
            if (typeof total[j] === "string") {
              total[j] = val;
            } else {
              total[j] += val;
            }
          }
        }
      }
    }

    const getIsFooterexist = () => {
      let isFooterexist = footerexist;
      if (
        metaData &&
        metaData.reportDetails &&
        (metaData.reportDetails.reportName == "TLApplicationStatusReport" ||
          metaData.reportDetails.reportName == "TLRegistryReport" ||
          metaData.reportDetails.reportName == "TLRenewalPendingReport")
      ) {
        isFooterexist = false;
      }
      return isFooterexist;
    };

    if (getIsFooterexist()) {
      return (
        <tfoot>
          <tr className="total">
            {sumColumn.map((columnObj, index) => {
              return (
                <th style={index !== 0 ? { textAlign: "right" } : {}} key={index}>
                  {index === 0
                    ? getLocaleLabels("RT_TOTAL", "RT_TOTAL")
                    : this.addCommas(Number(total[index - 1]) % 1 === 0 ? total[index - 1] : Number(total[index - 1]).toFixed(2))}
                </th>
              );
            })}
          </tr>
        </tfoot>
      );
    }
  };

  subHeader = (moduleName) => {
    let { metaData } = this.props;
    if (_.isEmpty(metaData)) {
      return;
    }

    let result = metaData && metaData.reportDetails && metaData.reportDetails.summary ? metaData.reportDetails.summary : "";

    this.setState({ reportSubTitle: result });
  };

  getReportTitle = (rptName) => {
    let reportName = rptName || this.state.reportName || "";
    reportName = reportName.toUpperCase();
    let reportTitleArr = reportName && getLocaleLabels(reportName, reportName).split(/(?=[A-Z])/);
    let reportTitle = "";
    if (reportTitleArr) {
      reportTitle = reportTitleArr.map((char) => {
        if (char.length == 1) {
          reportTitle = char + "";
        } else {
          reportTitle = " " + char;
        }
        return reportTitle;
      });
    }
    return reportTitle;
  };

  getXlsReportTitle = (rptName) => {
    let reportName = rptName || this.state.reportName || "";
    reportName = reportName.toUpperCase();
    let reportTitleArr = reportName && getLocaleLabels(reportName, reportName).split(/(?=[A-Z])/);
    let reportTitle = "";
    let reportHeaderName = "";
    if (reportTitleArr) {
      reportTitle = reportTitleArr.map((char) => {
        if (char.length == 1) {
          reportTitle = char + "";
          reportHeaderName += char;
        } else if (typeof char === "object") {
          reportTitle = char.text + "";
        } else {
          reportTitle = " " + char;
          reportHeaderName = reportHeaderName + " " + char;
        }
        return reportTitle;
      });
    }
    // return reportTitle;
    return [reportHeaderName];
  };

  render() {
    let { isTableShow, metaData, reportResult } = this.props;
    let self = this;
    const viewTabel = () => {
      return (
        <div>
          <table
            id="reportTable"
            style={{
              width: "100%",
            }}
            className="table table-striped table-bordered"
          >
            {self.renderHeader()}
            {self.renderBody()}

            {this.renderFooter()}
          </table>
          {metaData.reportDetails && metaData.reportDetails.viewPath && metaData.reportDetails.selectiveDownload && self.state.showPrintBtn ? (
            <div style={{ textAlign: "center" }}>
              <RaisedButton
                style={{ marginTop: "10px" }}
                label={translate("reports.print.details")}
                onClick={() => {
                  self.printSelectedDetails();
                }}
                primary={true}
              />
            </div>
          ) : (
            ""
          )}
          <br />
        </div>
      );
    };
    return isTableShow ? (
      <div>
        <div className="report-result-table">
          {isTableShow && !_.isEmpty(reportResult) && reportResult.hasOwnProperty("reportData") && viewTabel()}
        </div>
      </div>
    ) : null;
  }
}
const mapStateToProps = (state) => {
  return {
    isTableShow: state.formtemp.showTable,
    metaData: state.report.metaData,
    reportResult: state.report.reportResult,
    flag: state.report.flag,
    searchForm: state.formtemp.form,
    searchParams: state.report.searchParams,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setReportResult: (reportResult) => {
    dispatch({ type: "SET_REPORT_RESULT", reportResult });
  },
  setFlag: (flag) => {
    dispatch({ type: "SET_FLAG", flag });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: "TOGGLE_SNACKBAR_AND_SET_TEXT", snackbarState, toastMsg });
  },
  setRoute: (route) => dispatch({ type: "SET_ROUTE", route }),
  pushReportHistory: (history) => {
    dispatch({ type: "PUSH_REPORT_HISTORY", reportData: history });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowField);
