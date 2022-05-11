import {
  getCommonHeader, 
  getCommonCard, 
  getCommonTitle ,
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { toggleSpinner , toggleSnackbar} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import {downloadReceiptFromFilestoreID, downloadReceipt} from "../utils";

const getMyApplications = async (action, state, dispatch) => {
  try{
    const queryParams = [];
    let payload = null;
      payload = await httpRequest(
        "post",
        "birth-death-services/birth/_searchapplications",
        "_search",
        queryParams,
        {}
      );
    return payload;
  }
  catch(e)
  {
    toggleSnackbar(
      true,
      {
        labelName: "Could not load lease Details",
        labelKey: "ERR_API_ERROR"
      },
      "error"
    );
  }
  return null;
}

const certificateDowloadHandler = (fileStoreId) => {
  //Download Certificate by sending filestoreid and mode
  downloadReceiptFromFilestoreID(fileStoreId, 'download');
}

const downloadReceiptHandler = async (consumerCode, tenantId) => {
  downloadReceipt(consumerCode, tenantId);
}

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "BND_CITIZEN_MY_APPLICATIONS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const myApplications = {
  uiFramework: "material-ui",
  name: "myApplications",
  beforeInitScreen:(action, state, dispatch) => {

    dispatch(toggleSpinner());
    getMyApplications().then((response)=>{
      dispatch(toggleSpinner());
      try
      {
        dispatch(prepareFinalObject("searchResults",response.applications));
      }
      catch(e){
        toggleSnackbar(true,{
            labelName: "Could not load lease Details",
            labelKey: "ERR_API_ERROR"
          },
          "error"
        );
      }
    });

    // dispatch(prepareFinalObject("searchResults",[{
    //   "applicationCategory" : "BIRTH",
    //   "regNo": "975121388",  //Reg no of downloaded certificate
    //   "name": "Srikanth V",  //Name of downloaded certificate, 
    //   "applicationNumber": "RC-CB-AGRA-2020-001504", 
    //   "applicationDate": "54897212357",  
    //   "applicationType":"DOWNLOAD_CERT",
    //   "status" :"FREE_DOWNLOAD",// FREE_DOWNLOAD //PAID//PAID_DOWNLOAD 
    //   "tenantId": "pb.agra"
    // },
    // {
    //   "applicationCategory" : "BIRTH",
    //   "regNo": "975121388",  //Reg no of downloaded certificate
    //   "name": "Srikanth V",  //Name of downloaded certificate, 
    //   "applicationNumber": "RC-CB-AGRA-2020-001504", 
    //   "applicationDate": "54897212357",  
    //   "applicationType":"DOWNLOAD_CERT",
    //   "status" :"PAID",// FREE_DOWNLOAD //PAID//PAID_DOWNLOAD 
    //   "tenantId": "pb.agra"
    // },
    // {
    //   "applicationCategory" : "BIRTH",
    //   "regNo": "975121388",  //Reg no of downloaded certificate
    //   "name": "Srikanth V",  //Name of downloaded certificate, 
    //   "applicationNumber": "RC-CB-AGRA-2020-001504", 
    //   "applicationDate": "54897212357",  
    //   "applicationType":"DOWNLOAD_CERT",
    //   "status" :"PAID_DOWNLOAD",// FREE_DOWNLOAD //PAID//PAID_DOWNLOAD 
    //   "tenantId": "pb.agra"
    // },
    // ]));
    return action;
  },

  afterInitForm:(action, state, dispatch) => {
   
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        details: getCommonCard(
          {
            header: header,
              div: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                  applicationsCard: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-bnd",
                    componentPath: "SingleApplication",
                    visible: true,
                    props: {
                      contents: [
                        {
                          label: "BND_APPL_NO",
                          jsonPath: "applicationNumber"
                        },
                        {
                          label: "BND_APPL_DATE",
                          jsonPath: "applicationDate",
                          isDate: true,
                        },
                        {
                          label: "BND_CERT_REG_NO",
                          jsonPath: "regNo",
                        },
                        {
                          label: "BND_CERT_NAME",
                          jsonPath: "name"
                        },
                        {
                          label: "BND_APPL_TYPE",
                          jsonPath: "applicationType",
                          prefix: "BND_"
                        },
                        {
                          label: "BND_APPL_STATUS",
                          jsonPath: "status",
                          prefix: "BND_STATUS_"
                        },
                      ],
                      moduleName: "BIRTH",
                      homeURL: "/birth-citizen/home",
                      certificateDowloadHandler:certificateDowloadHandler,
                      downloadReceiptHandler: downloadReceiptHandler
                    }
                  }
                },
              
            }
          },
          {
            style: {
              overflow: "visible"
            }
          }
        ),
      },
    },
  }
};
export default myApplications;