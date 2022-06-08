import {
  getCommonHeader,
  getBreak,
  getCommonTitle,
  getCommonParagraph,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonCaption, getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
// import { getCommonGrayCard, getLabelOnlyValue } from "../../utils";
import { footer } from "./footer";
import "./index.css";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

const styles = {
  header: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "28px",
    paddingLeft: "5px"
  },
  subHeader: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px"
  },
  docs: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Roboto",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "17px",
    paddingBottom: "24px"
  },
  description: {
    fontFamily: "Roboto",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0.6px",
    lineHeight: "14px"
  }
};

const getHeader = (modulePrifx)=>{
  return getCommonHeader(
    {
      labelName: `Required Documents-${modulePrifx}`,
      labelKey:getTransformedLocale(`${modulePrifx}_REQ_DOCS_HEADER`) 
    },
    {
      style: styles.header
    }
  );
} 

 const getCommonGrayCard = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      body: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          ch1: getCommonCard(children, {
            style: {
              backgroundColor: "rgb(242, 242, 242)",
              boxShadow: "none",
              borderRadius: 0,
              overflow: "visible"
            }
          })
        },
        gridDefination: {
          xs: 12
        }
      }
    },
    gridDefination: {
      xs: 12
    }
  };
};

 const getLabelOnlyValue = (value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 4
    },
    props: {
      style: {
        marginBottom: "16px"
      },
      ...props
    },
    children: {
      value: getCommonCaption(value)
    }
  };
};


const generateDocument = ( item, modulePrifx ) => {
  // Add header to individual grey cards
  let subHeader =
    item.code &&
    getCommonTitle(
      {
        labelKey: getTransformedLocale(`${modulePrifx}_${item.code}_HEADING`)
      },
      {
        style: styles.subHeader
      }
    );

  // Add documents in individual grey cards
  let docs = {};
  if (item.hasOwnProperty("dropdownData")) {
    docs = item.dropdownData.reduce((obj, doc) => {
      obj[doc.code] = getLabelOnlyValue(
        {
          labelKey: getTransformedLocale(`${modulePrifx}_${doc.code}_LABEL`)
        },
        {
          style: styles.docs
        }
      );
      return obj;
    }, {});
  } else if (item.hasOwnProperty("options")) {
    docs = item.options.reduce((obj, doc) => {
      obj[doc.code] = getLabelOnlyValue(
        {
          labelKey: getTransformedLocale(`${modulePrifx}_${doc.code}_LABEL`)
        },
        {
          style: styles.docs
        }
      );
      return obj;
    }, {});
  }

  // Add description to individual grey cards
  let subParagraph = item.description
    ? getCommonParagraph(
        {
          labelKey: getTransformedLocale(`${modulePrifx}_${item.description}_NOTE`)
        },
        {
          style: styles.description
        }
      )
    : {};

  let subParagraph1 = getCommonParagraph(
    {
      labelKey: getTransformedLocale('ONE_OF_THESE_DOC_NEEDED')
    },
    {
      style: styles.description
    }
  )
  return getCommonGrayCard({
    subHeader: subHeader,
    break: getBreak(),
    subParagraph1: modulePrifx === "TradeLicense" ? {} : subParagraph1,
    break1: modulePrifx === "TradeLicense" ? {} : getBreak(),
    docs: getCommonContainer({ ...docs }),
    subParagraph: subParagraph
  });
};

export const getRequiredDocuments = ( documents, moduleName, footerCallback ) => {
  let doc = documents.map(item => {
    return generateDocument( item, moduleName );
  });
  const header= getHeader(moduleName);
  const footerChildElement= footer( footerCallback, moduleName );
  return getCommonContainer(
    {
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          className: "fixedHeader"
        },
        children: {
          header
        }
      },
      documents: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          ...doc
        },
        props: {
          id: "documents-div"
        }
      },
      footer: {
        uiFramework: "custom-atoms",
        props:{
          className:"footerSticky",
        },
        componentPath: "Container",
        children: {
          footerChildElement
        }
      }
    },
    {
      style: {
       // paddingBottom: 75
      }
    }
  );
};
