import React, { Component } from "react";
import WizardComponent from "./components/WizardComponent";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import {
  deleteForm,
  updateForms,
  handleFieldChange
} from "egov-ui-kit/redux/form/actions";
import {
  fetchAssessments,
} from "egov-ui-kit/redux/properties/actions";
import PTHeader from "egov-ui-kit/common/common/PTHeader";
import Label from "egov-ui-kit/utils/translationNode";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import {
  UsageInformationHOC,
  PropertyAddressHOC,
  OwnershipTypeHOC,
  OwnerInfoHOC,
  InstitutionHOC,
  OwnerInformation,
  InstitutionAuthorityHOC
} from "./components/Forms";
import ReviewForm from "./components/ReviewForm";
import FloorsDetails from "./components/Forms/FloorsDetails";
import PlotDetails from "./components/Forms/PlotDetails";
import MultipleOwnerInfoHOC from "./components/Forms/MultipleOwnerInfo";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { validateForm } from "egov-ui-kit/redux/form/utils";
import { displayFormErrors } from "egov-ui-kit/redux/form/actions";
import {
  getQueryValue,
  getFinancialYearFromQuery,
  getEstimateFromBill
} from "egov-ui-kit/utils/PTCommon";
import { get, set, isEqual, some } from "lodash";
import { fetchFromLocalStorage } from "egov-ui-kit/utils/commons";
import range from "lodash/range";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import {
  fetchGeneralMDMSData,
  generalMDMSFetchSuccess,
  updatePrepareFormDataFromDraft
} from "egov-ui-kit/redux/common/actions";
import PaymentDetails from "./components/PaymentDetails";
import { getDocumentTypes } from "./utils/mdmsCalls";
import { convertRawDataToFormConfig } from "egov-ui-kit/utils/PTCommon/propertyToFormTransformer";
import { fetchMDMDDocumentTypeSuccess } from "redux/store/actions";
import "./index.css";
import {
  addOwner,
  callDraft,
  configOwnersDetailsFromDraft,
  getTargetPropertiesDetails,
  getSelectedCombination,
  getSingleOwnerInfo,
  getMultipleOwnerInfo,
  getInstituteInfo,
  getCalculationScreenData,
  getHeaderLabel,
  validateUnitandPlotSize,
  normalizePropertyDetails,
  getImportantDates,
  renderPlotAndFloorDetails,
  removeAdhocIfDifferentFY
} from "egov-ui-kit/utils/PTCommon/FormWizardUtils";
import sortBy from "lodash/sortBy";
import {
  getTenantId,
  getUserInfo,
  getFinalData,
  getAccessToken
} from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import AcknowledgementCard from "egov-ui-kit/common/propertyTax/AcknowledgementCard";
import generateAcknowledgementForm from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/acknowledgementFormPDF";
import { getHeaderDetails } from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/createReceipt";
import DemandCollection from "egov-ui-kit/common/propertyTax/DemandCollection";
import { resetFormWizard } from "egov-ui-kit/utils/PTCommon";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import { prepareFormData as prepareFormDataAction } from "egov-ui-kit/redux/common/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { httpRequest as httpRequestnew } from "egov-ui-framework/ui-utils/api";

class FormWizardDataEntry extends Component {
  state = {
    dialogueOpen: false,
    financialYearFromQuery: "",
    selected: 0,
    ownerInfoArr: [],
    showOwners: false,
    formValidIndexArray: [],
    ownersCount: 0,
    estimation: [],
    importantDates: {},
    draftRequest: {
      draft: {
        tenantId: getTenantId(),
        userId: get(JSON.parse(getUserInfo()), "uuid"),
        draftRecord: {}
      }
    },
    propertyDetails: {},
    bill: [],
    partialAmountError: "",
    totalAmountToBePaid: 100,
    isFullPayment: true,
    valueSelected: "Full_Amount",
    nextButtonEnabled: true,
    calculationScreenData: [],
    assessedPropertyDetails: {},
    imageUrl: "",
    finlYear: "",
    editDemand: false,
    demands: []
  };

  updateTotalAmount = (value, isFullPayment, errorText) => {
    this.setState({
      totalAmountToBePaid: value,
      isFullPayment,
      partialAmountError: errorText
    });
  };

  fetchDraftDetails = async (draftId, isReassesment, draftUuid) => {
    const { draftRequest } = this.state;
    const {
      fetchMDMDDocumentTypeSuccess,
      updatePrepareFormDataFromDraft,
      location,
      generalMDMSDataById,
      prepareFinalObject
    } = this.props;
    const { search } = location;
    const financialYearFromQuery = getFinancialYearFromQuery();
    const propertyId = getQueryValue(search, "propertyId");
    const assessmentId = getQueryValue(search, "assessmentId");
    const tenantId = getQueryValue(search, "tenantId");
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    getImportantDates(this);
    try {
      let currentDraft;
      {    
        showSpinner();
        const demandPropertyResponse = await httpRequest(
          "billing-service/demand/_search",
          "_get",
          [
            {
              key: "tenantId",
              value: getTenantId()
            },
            {
              key: "consumerCode",
              value: getQueryValue(search, "propertyId")
            }
          ]
        );
        hideSpinner();
        {
          demandPropertyResponse.length != []
            ? prepareFinalObject(
                "DemandPropertiesResponse",
                demandPropertyResponse
              )
            : [];
        }
        const { generalMDMSDataById, getYearList } = this.props;


        let finalYear = "";
        let newkey = "";
        let mdmsYears = getYearList.filter(year => year.code.startsWith("PTAN"));

        
        const demands =
        (demandPropertyResponse &&
          demandPropertyResponse.Demands.sort(function(a, b) {
            return b.taxPeriodFrom - a.taxPeriodFrom;
          })) ||
        [];
        
      
        //hardcoded only 5 finantial years of data

          let duplicatedYears=0;

          demands.forEach((demand, yearKey) => {           
            if (demand.demandDetails)
            {
              let ptTax =0,ptSwatchatha=0, ptInterest =0, ptRebate =0, ptPromotionRebate = 0;
              for (let i=0; i<demand.demandDetails.length;i++)
              {             

                  if (demand.demandDetails[i].taxHeadMasterCode==="PT_TAX")  
                  {
                    ptTax = ptTax+1
                  }
                  else if(demand.demandDetails[i].taxHeadMasterCode==="SWATCHATHA_TAX")
                  {
                    ptSwatchatha =  ptSwatchatha+1
                  }
                  else if(demand.demandDetails[i].taxHeadMasterCode==="PT_TIME_INTEREST")
                  {
                    ptInterest =  ptInterest+1
                  }
                  else if(demand.demandDetails[i].taxHeadMasterCode==="PT_PROMOTIONAL_REBATE")
                  {
                    ptPromotionRebate =  ptPromotionRebate+1
                  }
                  else if(demand.demandDetails[i].taxHeadMasterCode==="PT_TIME_REBATE")
                  {
                    ptRebate =  ptRebate+1
                  }
              
             }
                if(ptTax>1 || ptSwatchatha> 1 || ptInterest>1 ||ptPromotionRebate>1 || ptRebate>1)
                  {
                    duplicatedYears = duplicatedYears+1
                  }   
           };
          });  
          
          if(duplicatedYears>0)
                  {
                    alert("This Property has duplicate demands for  please contact Administrator ");
                    duplicatedYears = duplicatedYears+1                    
                  } 


        demands.forEach((demand, yearKey) => {
          //add order for the taxt head and do the oerdering
          if (demand.demandDetails) {
            demand.demandDetails = demand.demandDetails
              .map(demandDetail => {
                return {
                  ...demandDetail,
                  order: get(
                    generalMDMSDataById,
                    `TaxHeadMaster.${demandDetail.taxHeadMasterCode}.order`,
                    -1
                  ),
                  isLegacy: get(
                    generalMDMSDataById,
                    `TaxHeadMaster.${demandDetail.taxHeadMasterCode}.legacy`,
                    false
                  )
                };
              })
              .sort(function(a, b) {
                return a.order - b.order;
              });
          } else {
            demand.demandDetails = [];
          }
          return demand.demandDetails.forEach((demandData, demandKey) => {
            if (demandData.order > -1 && demandData.isLegacy) {
              //year is greater, till get equarl to i have to null 
               
              let yearkeys = Object.keys(generalMDMSDataById.TaxPeriod).forEach(
                (item, i) => {
                  if (
                    generalMDMSDataById.TaxPeriod[item].fromDate ===
                    demand.taxPeriodFrom
                  ) {
                    finalYear = 
                    generalMDMSDataById.TaxPeriod[item].financialYear;
                  }
                            
                }
              );  

               prepareFinalObject(
                `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].PT_TAXHEAD`, 
                 demandData.taxHeadMasterCode
               ),
                 prepareFinalObject(
                   `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].PT_DEMAND`,
                   `${Math.trunc(demandData.taxAmount)}`
                 ),
                 prepareFinalObject(
                   `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].PT_COLLECTED`,
                   `${Math.trunc(demandData.collectionAmount)}`
                 );
               prepareFinalObject(
                 `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].ID`,
                 demandData.id
               );  
 
            /*   if()
              {
                prepareFinalObject(
                  `DemandProperties[0].propertyDetails[0].demand[${yearKey}]`, 
                   null
                 ),        
              } */


              
            }
          });
        });
       
    
      
      }

      if (!currentDraft) {
        throw new Error("draft not found");
      }

      this.setState({
        draftByIDResponse: currentDraft
        // ,
        // demands
      });
      const ownerFormKeys = Object.keys(currentDraft.draftRecord).filter(
        formName => formName.indexOf("ownerInfo_") !== -1
      );
      const { ownerDetails, totalowners } = configOwnersDetailsFromDraft(
        ownerFormKeys,
        OwnerInformation
      );
      const activeTab =
        get(currentDraft, "draftRecord.selectedTabIndex", 0) > 3
          ? 3
          : get(currentDraft, "draftRecord.selectedTabIndex", 0);
      const activeModule = get(
        currentDraft,
        "draftRecord.propertyAddress.fields.city.value",
        ""
      );
      if (!!activeModule) {
        const documentTypeMdms = await getDocumentTypes();
        if (!!documentTypeMdms) fetchMDMDDocumentTypeSuccess(documentTypeMdms);
      }
      if (isReassesment) {
        activeModule &&
          this.props.handleFieldChange("propertyAddress", "city", activeModule);
        let prepareFormData = get(
          currentDraft,
          "draftRecord.prepareFormData",
          {}
        );
        let lastAssessedFY = get(
          prepareFormData,
          "Properties[0].propertyDetails[0].financialYear"
        );
        lastAssessedFY !== financialYearFromQuery &&
          (prepareFormData = removeAdhocIfDifferentFY(
            prepareFormData,
            financialYearFromQuery
          ));
        set(currentDraft, "draftRecord.prepareFormData", prepareFormData);
      }

      updatePrepareFormDataFromDraft(
        get(currentDraft, "draftRecord.prepareFormData", {})
      );
      this.props.updatePTForms(currentDraft.draftRecord);

      //Get estimate from bill in case of complete payment
      if (isCompletePayment) {
        const billResponse =
          activeTab >= 3 &&
          isCompletePayment &&
          (await this.callGetBill(
            propertyId,
            assessmentId,
            financialYearFromQuery,
            tenantId,
            false
          ));
        const estimateFromGetBill = billResponse
          ? getEstimateFromBill(billResponse.Bill)
          : [];
        this.setState({
          estimation: estimateFromGetBill,
          totalAmountToBePaid:
            (estimateFromGetBill &&
              estimateFromGetBill[0] &&
              estimateFromGetBill[0].totalAmount) ||
            0,
          Bill: billResponse && billResponse.Bill
        });
      }
      this.setState(
        {
          ownerInfoArr: ownerDetails,
          ownersCount: totalowners,
          formValidIndexArray: range(0, activeTab),
          selected: activeTab,
          draftRequest: {
            draft: {
              id: null,
              ...currentDraft
            }
          }
        },
        () => {
          {
            // if (activeTab >= 3 && !isCompletePayment) {
            //   this.estimate().then(estimateResponse => {
            //     if (estimateResponse) {
            //       this.setState({
            //         estimation:
            //           estimateResponse && estimateResponse.Calculation,
            //         totalAmountToBePaid: get(
            //           estimateResponse,
            //           "Calculation[0].totalAmount",
            //           0
            //         )
            //       });
            //     }
            //   });
            // }
            if (activeTab === 4) this.pay();
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  componentWillReceiveProps = nextprops => {
    // if (nextProps.match.params.reportName !== this.props.match.params.reportName) {
    //   this.resetForm();
    // }
    if (!isEqual(nextprops, this.props)) {
      let inputType = document.getElementsByTagName("input");
      for (let input in inputType) {
        if (inputType[input].type === "number") {
          inputType[input].addEventListener("mousewheel", function() {
            this.blur();
          });
        }
      }
    }
  };

  fetchDemand = async (taxData) => {

    let {
      location,
      generalMDMSDataById,
      showSpinner,
      hideSpinner,     
      prepareFinalObject
    } = this.props;

    let { search } = location;


   // const data =  get(this.state.prepareFinalObject,"taxData", null)

     
   showSpinner();
    const demandPropertyResponse = await httpRequest(
      "billing-service/demand/_search",
      "_get",
      [
        {
          key: "tenantId",
          value: getTenantId()
        },
        {
          key: "consumerCode",
          value: getQueryValue(search, "propertyId")
        }
      ]
    );
    hideSpinner();
    {
    {
      demandPropertyResponse.length != []
        ? prepareFinalObject(
            "DemandPropertiesResponse",
            demandPropertyResponse
          )
        : [];
    }
    
      
  

     /*  {
        demandPropertyResponse.length != []
          ? prepareFinalObject(
              "DemandPropertiesResponse",
              demandPropertyResponse
            )
          : [];
      } */

    

      const { generalMDMSDataById, getYearList } = this.props;

      

      

      let finalYear = "";
      let newkey = "";
      let mdmsYears = getYearList.filter(year => year.code.startsWith("PTAN"));

       const demands =
      (demandPropertyResponse &&
        demandPropertyResponse.Demands.sort(function(a, b) {
          return b.taxPeriodFrom - a.taxPeriodFrom;
        })) ||
      [];    
    
      //hardcoded only 5 finantial years of data

        let duplicatedYears=0;

        demands.forEach((demand, yearKey) => {           
          if (demand.demandDetails)
          {
            let ptTax =0,ptSwatchatha=0, ptInterest =0, ptRebate =0, ptPromotionRebate = 0;
            for (let i=0; i<demand.demandDetails.length;i++)
            {             

                if (demand.demandDetails[i].taxHeadMasterCode==="PT_TAX")  
                {
                  ptTax = ptTax+1
                }
                else if(demand.demandDetails[i].taxHeadMasterCode==="SWATCHATHA_TAX")
                {
                  ptSwatchatha =  ptSwatchatha+1
                }
                else if(demand.demandDetails[i].taxHeadMasterCode==="PT_TIME_INTEREST")
                {
                  ptInterest =  ptInterest+1
                }
                else if(demand.demandDetails[i].taxHeadMasterCode==="PT_PROMOTIONAL_REBATE")
                {
                  ptPromotionRebate =  ptPromotionRebate+1
                }
                else if(demand.demandDetails[i].taxHeadMasterCode==="PT_TIME_REBATE")
                {
                  ptRebate =  ptRebate+1
                }
            
           }
              if(ptTax>1 || ptSwatchatha> 1 || ptInterest>1 ||ptPromotionRebate>1 || ptRebate>1)
                {
                  duplicatedYears = duplicatedYears+1
                }   
         };
        });  
        


        if(duplicatedYears>0)
                {
                  alert("This Property has duplicate demands for  please contact Administrator ");
                  duplicatedYears = duplicatedYears+1                    
                } 


      demands.forEach((demand, yearKey) => {
        //add order for the taxt head and do the oerdering
        if (demand.demandDetails) {
          demand.demandDetails = demand.demandDetails
            .map(demandDetail => {
              return {
                ...demandDetail,
                order: get(
                  generalMDMSDataById,
                  `TaxHeadMaster.${demandDetail.taxHeadMasterCode}.order`,
                  -1
                ),
                isLegacy: get(
                  generalMDMSDataById,
                  `TaxHeadMaster.${demandDetail.taxHeadMasterCode}.legacy`,
                  false
                )
              };
            })
            .sort(function(a, b) {
              return a.order - b.order;
            });
        } else {
          demand.demandDetails = [];
        }
        return demand.demandDetails.forEach((demandData, demandKey) => {

       
          if (demandData.order > -1 && demandData.isLegacy) {
            //year is greater, till get equarl to i have to null 
             
            let yearkeys = Object.keys(generalMDMSDataById.TaxPeriod).forEach(
              (item, i) => {
                if (
                  generalMDMSDataById.TaxPeriod[item].fromDate ===
                  demand.taxPeriodFrom
                ) {
                  finalYear = 
                  generalMDMSDataById.TaxPeriod[item].financialYear;
                }
                          
              }
            );  

            let latestFinalData = getFinalData();

            for(let i=0; latestFinalData && i<latestFinalData.length;i++)
            {
              if(finalYear===latestFinalData[i].financialYear)
              yearKey =i;
            }
                   
            prepareFinalObject(
              `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].PT_TAXHEAD`, 
               demandData.taxHeadMasterCode
             ),
               prepareFinalObject(
                 `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].PT_DEMAND`,
                 `${Math.trunc(demandData.taxAmount)}`
               ),
               prepareFinalObject(
                 `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].PT_COLLECTED`,
                 `${Math.trunc(demandData.collectionAmount)}`
               );
             prepareFinalObject(
               `DemandProperties[0].propertyDetails[0].demand[${yearKey}].demand[${finalYear}][${demandData.order}].ID`,
               demandData.id
             );  

          /*   if()
            {
              prepareFinalObject(
                `DemandProperties[0].propertyDetails[0].demand[${yearKey}]`, 
                 null
               ),        
            } */


            
          }
        });

      });


  
    }
  
  }

  componentDidMount = async () => {
    let {
      location,
      generalMDMSDataById,
      fetchMDMDDocumentTypeSuccess,
      renderCustomTitleForPt,
      showSpinner,
      hideSpinner,
      fetchGeneralMDMSData,
      history,
      cities,
      finalData,
      fetchAssessments
    } = this.props;
    let { search } = location;
    let { resetForm } = this;

    this.unlisten = history.listen((location, action) => {
      resetForm();
    });

    showSpinner();
    const { selected, finlYear } = this.state;

    const isReasses = Boolean(
      getQueryValue(search, "isReassesment").replace("false", "")
    );
    const propertyId = getQueryValue(search, "propertyId");
    const isReassesment = Boolean(
      getQueryValue(search, "isReassesment").replace("false", "")
    );
    const tenantId = getQueryValue(search, "tenantId") || getTenantId();
    const draftUuid = getQueryValue(search, "uuid");
    const edit = getQueryValue(search, "edit");
    // const tenantId1 = getTenantId() || "uk";

    const assessmentId =
      getQueryValue(search, "assessmentId") || fetchFromLocalStorage("draftId");

      fetchGeneralMDMSData(
        null,
        "PropertyTax",
        [
          "Floor",
          "OccupancyType",
          "OwnerShipCategory",
          "ConstructionType",
          "OwnerType",
          "PropertySubType",
          "PropertyType",
          "SubOwnerShipCategory",
          "UsageCategoryDetail",
          "UsageCategoryMajor",
          "UsageCategoryMinor",
          "UsageCategorySubMinor",
          "Rebate",
          "Penalty",
          "Interest",
          "FireCess",
          "RoadType",
          "Thana"
        ],
        "",
        tenantId
      );
      fetchGeneralMDMSData(
        null,
        "BillingService",
        ["TaxPeriod", "TaxHeadMaster"],
        "",
        tenantId
      );

      let taxData;

   let mdmsBody = {
    MdmsCriteria: {
      tenantId: "uk",
      moduleDetails: [
       {
          moduleName: "BillingService",
          masterDetails: [
            {
              name: "TaxPeriod",
            },
            {
              name: "TaxHeadMaster",
            }
          ]
        },       
      ]
    }
  };

  fetchAssessments([
    { key: "propertyIds", value: propertyId },
    { key: "tenantId", value: tenantId },
  ]);

  try {
    showSpinner();
    const payload =  await httpRequestnew(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    hideSpinner();
    taxData = payload.MdmsRes.BillingService;

   // dispatch(prepareFinalObject("taxData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }

  if(edit)
  {
    this.fetchDemand(taxData)
  }


  
      //await this.fetchDraftDetails(assessmentId, isReassesment, draftUuid);

      if (selected > 2) {
        const {
          tenantId: id
        } = this.state.assessedPropertyDetails.Properties[0].propertyDetails[0];
        let ulbLogo;
        cities.forEach((city)=>{
          if (city.key===id) {
            ulbLogo=city.logoId;
          }
        })


        let receiptImageUrl = ulbLogo;
        this.convertImgToDataURLviaCanvas(
          receiptImageUrl,
          function(data) {
            this.setState({ imageUrl: data });
          }.bind(this)
        );
      }
    

    const { ownerInfoArr } = this.state;

    if (ownerInfoArr.length < 2) {
      addOwner(true, OwnerInformation, this);
    }

    const documentTypeMdms = await getDocumentTypes();
    if (!!documentTypeMdms) fetchMDMDDocumentTypeSuccess(documentTypeMdms);

    const financialYearFromQuery = getFinancialYearFromQuery();
    this.setState({
      financialYearFromQuery
    });

    const titleObject = isReasses
      ? ["PT_REASSESS_PROPERTY"]
      : [
          "PT_DEMAND_PROPERTY_ASSESSMENT_HEADER",
          `(${financialYearFromQuery})`,
          ":",
          "PT_ADD_NEW_PROPERTY"
        ];

    renderCustomTitleForPt({ titleObject });
    hideSpinner();
  };

  componentWillUnmount() {
    this.unlisten();
    this.props.prepareFinalObject("DemandPropertiesResponse",{});
  }

  handleRemoveOwner = (index, formKey) => {
    const { ownerInfoArr } = this.state;
    const updatedOwnerArr = [...ownerInfoArr];
    updatedOwnerArr.splice(
      ownerInfoArr.findIndex(ownerData => ownerData.index === index),
      1
    );
    this.setState({
      ownerInfoArr: updatedOwnerArr
    });
    this.props.deleteForm(formKey);
  };

  getConfigFromCombination = (combination, fetchConfigurationFn) => {
    let configObject = fetchConfigurationFn(combination);
    return configObject;
  };

  getOwnerDetails = ownerType => {
    const { selected } = this.state;
    const isReviewPage = selected === 4;
    if (ownerType && ownerType.includes("SINGLEOWNER")) {
      return <OwnerInfoHOC disabled={isReviewPage} />;
    } else if (ownerType && ownerType.includes("MULTIPLEOWNERS")) {
      return (
        <MultipleOwnerInfoHOC
          addOwner={() => {
            addOwner(false, OwnerInformation, this);
          }}
          handleRemoveOwner={this.handleRemoveOwner}
          ownerDetails={this.state.ownerInfoArr}
          disabled={isReviewPage}
        />
      );
    } else {
      return (
        <div>
          <InstitutionHOC disabled={isReviewPage} />
          <InstitutionAuthorityHOC
            cardTitle={
              <Label
                label="PT_DETAILS_OF_AUTHORISED_PERSON"
                defaultLabel="Details of authorised person"
              />
            }
            disabled={isReviewPage}
          />
        </div>
      );
    }
    // switch (ownerType) {
    //   case "SINGLEOWNER":
    //     return <OwnerInfoHOC disabled={isReviewPage} />;
    //   case "MULTIPLEOWNERS":
    //     return (
    //       <MultipleOwnerInfoHOC
    //         addOwner={() => {
    //           addOwner(false, OwnerInformation, this);
    //         }}
    //         handleRemoveOwner={this.handleRemoveOwner}
    //         ownerDetails={this.state.ownerInfoArr}
    //         disabled={isReviewPage}
    //       />
    //     );
    //   // case "INSTITUTIONALPRIVATE":
    //   // case "INSTITUTIONALGOVERNMENT":
    //   //   return (
    //   //     <div>
    //   //       <InstitutionHOC disabled={isReviewPage} />
    //   //       <InstitutionAuthorityHOC
    //   //         cardTitle={
    //   //           <Label
    //   //             label="PT_DETAILS_OF_AUTHORISED_PERSON"
    //   //             defaultLabel="Details of authorised person"
    //   //           />
    //   //         }
    //   //         disabled={isReviewPage}
    //   //       />
    //   //     </div>
    //   //   );
    //   default:
    //      return (
    //       <div>
    //         <InstitutionHOC disabled={isReviewPage} />
    //         <InstitutionAuthorityHOC
    //           cardTitle={
    //             <Label
    //               label="PT_DETAILS_OF_AUTHORISED_PERSON"
    //               defaultLabel="Details of authorised person"
    //             />
    //           }
    //           disabled={isReviewPage}
    //         />
    //       </div>
    //     );;
    // }
  };

  updateEstimate = () => {
    this.estimate().then(estimateResponse => {
      if (estimateResponse) {
        this.setState({
          estimation: estimateResponse ? estimateResponse.Calculation : [],
          totalAmountToBePaid:
            estimateResponse &&
            estimateResponse.Calculation &&
            estimateResponse.Calculation[0].totalAmount,
          valueSelected: "Full_Amount"
        });
      }
    });
  };

  onRadioButtonChange = e => {
    let { estimation } = this.state;
    let { totalAmount } = estimation[0] || {};
    if (e.target.value === "Full_Amount") {
      this.setState({
        totalAmountToBePaid: totalAmount,
        valueSelected: "Full_Amount",
        partialAmountError: ""
      });
    } else {
      this.setState({
        totalAmountToBePaid: 100,
        valueSelected: "Partial_Amount"
      });
    }
  };

  renderStepperContent = (selected, fromReviewPage) => {
    const { getOwnerDetails, updateEstimate } = this;
    const {
      draftRequest,
      estimation,
      totalAmountToBePaid,
      financialYearFromQuery,
      importantDates,
      valueSelected,
      partialAmountError,
      assessedPropertyDetails
    } = this.state;
    const { onRadioButtonChange, updateTotalAmount } = this;
    const { location, finalData } = this.props;
    const { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    const isAssesment = getQueryValue(search, "assessment");
    switch (selected) {
      case 0:
        return (
          <div>
            <DemandCollection
              disabled={fromReviewPage}
              datas={this.props.finalData}
              propsData={this.props}
              isAssesment={isAssesment}
            />
          </div>
        );

      case 1:
        return (
          <div className="review-pay-tab">
            <ReviewForm
              properties={get(
                this.props["prepareFormData"],
                "Properties[0]",
                []
              )}
              onTabClick={this.onTabClick}
              updateIndex={this.updateIndex}
              stepZero={this.renderStepperContent(0, fromReviewPage)}
              // stepOne={this.renderStepperContent(1, fromReviewPage)}
            //  stepTwo={this.renderStepperContent(2, fromReviewPage)}
              estimationDetails={estimation}
              updateEstimate={updateEstimate}
              importantDates={importantDates}
              totalAmount={totalAmountToBePaid}
              isCompletePayment={isCompletePayment}
              calculationScreenData={this.state.calculationScreenData}
            />
          </div>
        );

      case 2:
        return (
          <div>
            <AcknowledgementCard
              acknowledgeType="success"
              receiptHeader="PT_ASSESSMENT_NO"
              messageHeader={this.getMessageHeader()}
              message={this.getMessage()}
              // receiptNo={
              //   assessedPropertyDetails["Properties"][0]["propertyDetails"][0][
              //     "assessmentNumber"
              //   ]
              // }
            />
          </div>
        );
      case 3:
        return (
          <div>
            <PaymentDetails
              onRadioButtonChange={onRadioButtonChange}
              updateTotalAmount={updateTotalAmount}
              estimationDetails={estimation}
              financialYr={financialYearFromQuery}
              totalAmountToBePaid={totalAmountToBePaid}
              optionSelected={valueSelected}
              importantDates={importantDates}
              partialAmountError={partialAmountError}
              isPartialPaymentInValid={
                get(this.state, "estimation[0].totalAmount", 1) < 100 ||
                get(
                  this.props.form,
                  "basicInformation.fields.typeOfBuilding.value",
                  ""
                ).toLowerCase() === "vacant"
              }
            />
          </div>
        );
      case 4:
        return (
          <div>
            <AcknowledgementCard
              acknowledgeType="success"
              receiptHeader="PT_PMT_RCPT_NO"
              messageHeader="PT_PROPERTY_PAYMENT_SUCCESS"
              message="PT_PROPERTY_PAYMENT_NOTIFICATION"
              receiptNo="PT-107-017574"
            />
          </div>
        );
      default:
        return null;
    }
  };
  getButtonLabels(index) {
    
    let { search } = this.props.location;

 /*    let isReassesment = Boolean(
      getQueryValue(search, "isReassesment").replace("false", "")
    );
    let isAssesment = Boolean(
      getQueryValue(search, "isAssesment").replace("false", "")
    ); */
    let edit = getQueryValue(search, "edit");
    let buttonLabel = "";
   
    if (index == 0) {
      buttonLabel = "PT_COMMONS_NEXT"
    }
    else if (index == 1) {
      edit ? buttonLabel = "PT_UPDATE_DEMAND": buttonLabel = "PT_CREATE_DEMAND"
    }
    else if (index == 2) {
      buttonLabel = "PT_HOME";
    }

    return buttonLabel;
  }
  getMessageHeader() {
    let { search } = this.props.location;

    let buttonLabel = "";

    let edit = getQueryValue(search, "edit");

    edit?buttonLabel="PT_PROPERTY_DEMAND_UPDATE_SUCCESS":buttonLabel="PT_PROPERTY_DEMAND_ADD_SUCCESS";

    return buttonLabel;
  }
  getMessage() {
    let { search } = this.props.location;

    let edit = getQueryValue(search, "edit");


    let buttonLabel = "";

    edit?buttonLabel="PT_PROPERTY_DEMAND_ASSESS_UPDATE_NOTIFICATION":buttonLabel="PT_PROPERTY_DEMAND_ADD_ASSESS_NOTIFICATION";

    return buttonLabel;
  }
  getHeader(selected, search, PTUID) {
    const locale = getLocale() || "en_IN";
    const localizationLabelsData = initLocalizationLabels(locale);
    const addNewPropertyLabel = getTranslatedLabel(
      "PT_NEW_PROPERTY_HEADER",
      localizationLabelsData
    );
    const propertyId = getQueryValue(search, "propertyId") || PTUID;
    const assessmentYear = getQueryValue(search, "FY");
    let isReassesment = Boolean(
      getQueryValue(search, "isReassesment").replace("false", "")
    );
    let isAssesment = Boolean(
      getQueryValue(search, "isAssesment").replace("false", "")
    );
    let headerObj = {};
    headerObj.header = "PT_DEMAND_PROPERTY_INFORMATION";
    headerObj.headerValue = "";
    headerObj.subHeaderValue = propertyId;
    switch (selected) {
      case 0:
      headerObj.header = "PT_DEMAND_PROPERTY_ASSESSMENT_HEADER";
      headerObj.subHeaderValue = propertyId;
        break;
      case 1:
      headerObj.header = "PT_DEMAND_PROPERTY_ASSESSMENT_HEADER";
      headerObj.subHeaderValue = propertyId;
      break;   
      default:
        headerObj.header = "PT_DEMAND_PROPERTY_INFORMATION";       
        headerObj.subHeaderValue = propertyId;
    }
    return headerObj;
  }

  onTabClick = index => {
    const { formValidIndexArray, selected } = this.state;
    const { location } = this.props;
    let { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    if (formValidIndexArray.indexOf(index) !== -1 && selected >= index) {
      !isCompletePayment
        ? this.setState({
            selected: index,
            formValidIndexArray: range(0, index)
          })
        : alert("Not authorized to edit this property details");
    }
  };

  updateIndex = index => {
    const {
      pay,
      estimate,
      createReceipt,
      createAndUpdate,
      createDemand,
      onPayButtonClick
    } = this;
    const {
      selected,
      formValidIndexArray,
      financialYearFromQuery,
      estimation
    } = this.state;
    const {
      setRoute,
      displayFormErrorsAction,
      form,
      history,
      location,
      prepareFormData = {}
    } = this.props;
    const { search } = location;
    const isAssesment = getQueryValue(search, "assessment");
    switch (selected) {
      //validating property address is validated
      case 0:
      showSpinner();
        let {
          DemandProperties = [],
          DemandPropertiesResponse,
          prepareFinalObject,
          generalMDMSDataById = {}
        } = this.props;
        const demand = get(
          DemandProperties,
          "[0].propertyDetails[0].demand",
          []
        );
        let errorCode = "FINE";
        let previousKey = -1;
        let previousYear = "";
        let demandLength = demand.length;
        let arrayOfEmptyYears = [];

        const callToggleSnackbar = (labelKey, labelName) => {
          this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName,
              labelKey
            },
            "error"
          );
        };

        const checkPtTaxWithRebate = (
          taxHead,
          demandAmount,
          taxDetails = [],
          getTotalRebateAmount = false
        ) => {
          const rebateHeadObject = get(
            generalMDMSDataById,
            `TaxHeadMaster.${taxHead}`,
            {}
          );
          if (rebateHeadObject.code === "PT_TAX") {
            let rebateHeads = [];
            Object.keys(get(generalMDMSDataById, `TaxHeadMaster`, {})).forEach(
              key => {
                const object = get(
                  generalMDMSDataById,
                  `TaxHeadMaster.${key}`,
                  {}
                );
                if (object.legacy && object.category === "REBATE") {
                  rebateHeads.push(object);
                }
              }
            );
            let rebateAmount = 0;
            rebateHeads.forEach((rebateHead, i) => {
              taxDetails.forEach((taxRebate, i) => {
                if (
                  taxRebate.PT_TAXHEAD === rebateHead.code &&
                  taxRebate.PT_DEMAND
                ) {
                  rebateAmount = rebateAmount + parseInt(taxRebate.PT_DEMAND);
                }
              });
            });
            return getTotalRebateAmount
              ? rebateAmount
              : demandAmount + rebateAmount;
          } else {
            return demandAmount;
          }
        };

        const checkRebate = taxHead => {
          const rebateHeads = get(
            generalMDMSDataById,
            `TaxHeadMaster.${taxHead}`,
            {}
          );
          if (rebateHeads.legacy && rebateHeads.category === "REBATE") {
            return false;
          } else {
            return true;
          }
        };

        if (!demandLength) {
          errorCode = "ERR01_DEMAND_ENTER_THE_DATA";
        } else {
          if (!demand[0]) {
            errorCode = "ERR02_DEMAND_ENTER_THE_DATA";
          }
          demand.forEach((data, key) => {
            data &&
              Object.keys(data.demand).forEach((data1, key1) => {
                // let currentYearTaxHeadLength=Object.keys(data.demand[data1]).length;
                let currentYearEnteredValueLength = 0;
                let hasPropertyTax = false;
                let propertyTaxAmount = 0;
                let totalRebateAmount = 0;
                // let previousYear=data1;
                Object.keys(data.demand[data1]).forEach((data2, key2) => {
                  if (
                    !data.demand[data1][data2].PT_DEMAND &&
                    data.demand[data1][data2].PT_COLLECTED &&
                    parseInt(data.demand[data1][data2].PT_COLLECTED)
                  ) {
                    errorCode = "ERR03_DEMAND_ENTER_THE_DATA";
                  }
                  if (data.demand[data1][data2].PT_DEMAND) {
                    currentYearEnteredValueLength++;
                    if (previousKey != -1) {
                      if (key - previousKey > 1) {
                        errorCode = "ERR04_DEMAND_ENTER_THE_DATA";
                      }
                    }
                    if (data.demand[data1][data2].PT_TAXHEAD === "PT_TAX") {
                      hasPropertyTax = true;
                      propertyTaxAmount = data.demand[data1][data2].PT_DEMAND;
                      let collectedAmount = parseInt(data.demand[data1][data2].PT_COLLECTED);
                      totalRebateAmount = checkPtTaxWithRebate(
                        data.demand[data1][data2].PT_TAXHEAD,
                        parseInt(data.demand[data1][data2].PT_DEMAND),
                        data.demand[data1],
                        true
                      );

                      if(!(propertyTaxAmount>=Math.abs(totalRebateAmount)))
                      {
                        errorCode = "ERR07_DEMAND_ENTER_THE_DATA";
                      }

                      if(collectedAmount<0)
                      {
                        errorCode = "ERR08_DEMAND_ENTER_THE_DATA";
                      }
                     
                    }
                    if (
                      checkRebate(data.demand[data1][data2].PT_TAXHEAD) &&
                      data.demand[data1][data2].PT_COLLECTED &&
                      parseInt(data.demand[data1][data2].PT_COLLECTED) &&
                      checkPtTaxWithRebate(
                        data.demand[data1][data2].PT_TAXHEAD,
                        parseInt(data.demand[data1][data2].PT_DEMAND),
                        data.demand[data1]
                      ) !== parseInt(data.demand[data1][data2].PT_COLLECTED)
                    ) {
                      if(!isAssesment)
                      {
                      errorCode = "ERR03_DEMAND_ENTER_THE_DATA";
                      }
                    }
                    // if (!previousYear ||previousYear!=data1) {
                    if (key2 == 0) {
                      previousKey = key;
                    }

                     if (data.demand[data1][data2].PT_TAXHEAD === "PT_TIME_REBATE" &&  data.demand[data1][data2].PT_DEMAND ==='0') 
                    {  
                    hasPropertyTax = true;  
                      data.demand[data1][data2].PT_DEMAND = -0;                   
                     
                    } 
                    if (data.demand[data1][data2].PT_TAXHEAD === "PT_PROMOTIONAL_REBATE" && data.demand[data1][data2].PT_DEMAND ==='0') 
                    {  
                      hasPropertyTax = true;  
                        data.demand[data1][data2].PT_DEMAND = -0;                   
                     } 
                    
                    // }
                  }
                });                
                if (!currentYearEnteredValueLength) {
                  arrayOfEmptyYears.push(key);
                } else {
                  if (!hasPropertyTax) {
                    errorCode = "ERR05_DEMAND_ENTER_THE_DATA";
                  } else if (parseInt(propertyTaxAmount) < totalRebateAmount) {
                    errorCode = "ERR06_DEMAND_ENTER_THE_DATA";
                  }
                }
              });
          });
        }
       
       /*  arrayOfEmptyYears.forEach((item, i) => {
          set(DemandProperties, `[0].propertyDetails[0].demand[${item}]`, null);
        });  */

        let emptyDemands =0;

        DemandProperties[0].propertyDetails[0].demand && DemandProperties[0].propertyDetails[0].demand.forEach((item, i)=>
        {
          if(item===undefined)
          emptyDemands++           
        });        


        if (emptyDemands === demand.length) {
          errorCode = "ERR01_DEMAND_ENTER_THE_DATA";
        }

        if (arrayOfEmptyYears.indexOf(0) != -1) {
          errorCode = "ERR02_DEMAND_ENTER_THE_DATA";
        }

        if (isAssesment) {
/*           errorCode = "FINE";
          let demandResponse = DemandPropertiesResponse.Demands
          demand.map((item,index)=>{
            let data = item.demand[Object.keys(item.demand)]
            data.map((ele,i)=>{
              if(ele.PT_TAXHEAD === "PT_TAX" || ele.PT_TAXHEAD ==="SWATCHATHA_TAX" || ele.PT_TAXHEAD === "PT_TIME_INTEREST"){
                  if(i < demandResponse[index] && demandResponse[index].demandDetails && demandResponse[index].demandDetails.length &&  ele.PT_DEMAND < demandResponse[index] && demandResponse[index].demandDetails[i] && demandResponse[index].demandDetails[i].taxAmount){
                    errorCode = "ERR09_DEMAND_ENTER_THE_DATA";
                  }
                
              }
            })
          }) */
        } 

        switch (errorCode) {
          case "ERR01_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR01_DEMAND_ENTER_THE_DATA",
              "Please enter at least one year of demand and collection !"
            );
            break;
          case "ERR02_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR02_DEMAND_ENTER_THE_DATA",
              "Please enter the latest year of demand and collection !"
            );
            break;
          case "ERR04_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR04_DEMAND_ENTER_THE_DATA",
              "The demand entry is not sequential !"
            );
            break;
          case "ERR03_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR03_DEMAND_ENTER_THE_DATA",
              "The entered collection should not greater than demand amount for any year !"
            );
            break;
          case "ERR05_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR05_DEMAND_ENTER_THE_DATA",
              "The property tax amount is mandatory for given financial year !"
            );
            break;
          case "ERR06_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR06_DEMAND_ENTER_THE_DATA",
              "The entered rebate should not greater than property tax amount for any year !"
            );
            break;
          case "ERR07_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR07_DEMAND_ENTER_THE_DATA",
              "The property amount is greater than rebate and promotional rebate"
            );
            break;
          case "ERR08_DEMAND_ENTER_THE_DATA":
            callToggleSnackbar(
              "ERR08_DEMAND_ENTER_THE_DATA",
              "The Collection amount is greater than zero value "
            );
            break;  
          case "ERR09_DEMAND_ENTER_THE_DATA":
              callToggleSnackbar(
                "ERR09_DEMAND_ENTER_THE_DATA",
                "The tax cannot be less than the previous tax"
              );
              break;  
          default:
            if (arrayOfEmptyYears.length > 0) {
              prepareFinalObject("DemandProperties", DemandProperties);
            }
            this.setState({
              selected: index,
              formValidIndexArray: [...formValidIndexArray, selected]
            });
        }
        hideSpinner();
        break;
      case 1:
        // if (estimation[0].totalAmount < 0) {
        //   alert("Property Tax amount cannot be Negative!");
        // } else {
        // window.scrollTo(0, 0);
        // createAndUpdate(index);
        // }
        // break;
        showSpinner();      
        window.scrollTo(0, 0);
        //createAndUpdate(index);
        createDemand(index);
        hideSpinner();
        break;
      case 2:
       /*  const { assessedPropertyDetails = {} } = this.state;
        let { Properties = [] } = assessedPropertyDetails;
        let propertyId = "";
        let tenantId = "";
        for (let pty of Properties) {
          propertyId = pty.propertyId;
          tenantId = pty.tenantId;
        } */
        // let url1 = "property-tax/search-property";
        // window.location.href = `${window.origin}/${url1}`;
        history.push(`/`);
        // this.setState(
        //   {
        //     selected: index,
        //     formValidIndexArray: [...formValidIndexArray, selected]
        //   });
        break;
      
    }
  };


 

  callGetBill = async (
    propertyId,
    assessmentNumber,
    assessmentYear,
    tenantId,
    amountExpected
  ) => {
    const { location } = this.props;
    const {
      isFullPayment,
      totalAmountToBePaid,
      estimation,
      valueSelected
    } = this.state;
    const { search } = location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    const queryObj = [
      { key: "consumerCodes", value: propertyId },
      { key: "tenantId", value: tenantId }
    ];
    // amountExpected &&
    //   queryObj.push({
    //     key: "amountExpected",
    //     value:
    //       valueSelected === "Full_Amount"
    //         ? estimation[0].totalAmount
    //         : totalAmountToBePaid
    //   });

    try {
      showSpinner();
      const billResponse = await httpRequest(
        "pt-calculator-v2/propertytax/_getbill",
        "_create",
        queryObj,
        {}
      );
      hideSpinner();
      return billResponse;
    } catch (e) {
      console.log(e);
      this.props.history.push(
        `payment-failure/${propertyId}/${tenantId}/${assessmentNumber}/${assessmentYear}`
      );
    }
  };

  callPGService = async (
    propertyId,
    assessmentNumber,
    assessmentYear,
    tenantId
  ) => {
    const { updateIndex } = this;
    const { isFullPayment, totalAmountToBePaid, estimation } = this.state;
    const { search } = this.props.location;
    const isCompletePayment = getQueryValue(search, "isCompletePayment");
    this.setState({
      propertyDetails: {
        propertyId,
        assessmentNumber,
        assessmentYear,
        tenantId
      }
    });
    try {
      // if (!isCompletePayment) {
      const getBill = await this.callGetBill(
        propertyId,
        assessmentNumber,
        assessmentYear,
        tenantId,
        true
      );
      const { Bill } = getBill && getBill;
      this.createReceipt(Bill);
      // }
      // updateIndex(4);
    } catch (e) {
      console.log(e);
    }
  };

  changeDateToFormat = date => {
    return new Date(date).getTime();
  };

  createReceipt = async (Bill = []) => {
    const { prepareFormData, hideSpinner } = this.props;
    const { propertyDetails } = this.state;
    const {
      assessmentNumber,
      propertyId,
      tenantId,
      assessmentYear
    } = propertyDetails;
    set(prepareFormData, "Receipt[0].Bill[0].billDetails[0].amountPaid", 0); //todo Consumer code uniqueness //i guess here
    prepareFormData.Receipt[0].Bill[0] = {
      ...Bill[0],
      ...prepareFormData.Receipt[0].Bill[0]
    };
    // prepareFormData.Receipt[0].Bill[0].billDetails[0] = {
    //   ...Bill[0].billDetails[0],
    //   ...prepareFormData.Receipt[0].Bill[0].billDetails[0]
    // };

    for (let index = 0; index < Bill[0].billDetails.length; index++) {
      prepareFormData.Receipt[0].Bill[0].billDetails[index] = {
        ...Bill[0].billDetails[index],
        ...prepareFormData.Receipt[0].Bill[0].billDetails[index],
        collectionType: "COUNTER"
      };
    }
    if (!get(prepareFormData, "Receipt[0].instrument.instrumentType.name")) {
      set(prepareFormData, "Receipt[0].instrument.instrumentType.name", "Cash");
    }
    set(
      prepareFormData,
      "Receipt[0].Bill[0].billDetails[0].amountPaid",
      this.state.totalAmountToBePaid
    );
    //CS v1.1 changes
    set(
      prepareFormData,
      "Receipt[0].Bill[0].taxAndPayments[0].amountPaid",
      this.state.totalAmountToBePaid
    );
    // set(
    //   prepareFormData,
    //   "Receipt[0].Bill[0].billDetails[0].collectionType",
    //   "COUNTER" // HardCoding collectionType to COUNTER - Discussed with BE
    // );
    //----------------
    set(
      prepareFormData,
      "Receipt[0].instrument.tenantId",
      get(prepareFormData, "Receipt[0].Bill[0].tenantId")
    );
    if (get(prepareFormData, "Receipt[0].instrument.transactionDateInput")) {
      set(
        prepareFormData,
        "Receipt[0].instrument.transactionDateInput",
        this.changeDateToFormat(
          get(prepareFormData, "Receipt[0].instrument.transactionDateInput")
        )
      );
      //Dont delete
      // set(
      //   prepareFormData,
      //   "Receipt[0].instrument.instrumentDate",
      //   this.changeDateToFormat(get(prepareFormData, "Receipt[0].instrument.transactionDateInput"))
      // );
    }
    //Dont delete
    // if (get(prepareFormData, "Receipt[0].instrument.transactionNumber")) {
    //   set(prepareFormData, "Receipt[0].instrument.instrumentNumber", get(prepareFormData, "Receipt[0].instrument.transactionNumber"));
    // }

    get(
      prepareFormData,
      "Receipt[0].Bill[0].billDetails[0].manualReceiptDate"
    ) &&
      set(
        prepareFormData,
        "Receipt[0].Bill[0].billDetails[0].manualReceiptDate",
        this.changeDateToFormat(
          get(
            prepareFormData,
            "Receipt[0].Bill[0].billDetails[0].manualReceiptDate"
          )
        )
      );
    set(
      prepareFormData,
      "Receipt[0].instrument.amount",
      this.state.totalAmountToBePaid
    );
    set(
      prepareFormData,
      "Receipt[0].tenantId",
      get(prepareFormData, "Receipt[0].Bill[0].tenantId")
    );
    const formData = {
      Receipt: prepareFormData["Receipt"]
    };

    if (
      get(prepareFormData, "Receipt[0].instrument.transactionNumber") &&
      get(prepareFormData, "Receipt[0].instrument.transactionNumberConfirm") &&
      get(prepareFormData, "Receipt[0].instrument.transactionNumber") !==
        get(prepareFormData, "Receipt[0].instrument.transactionNumberConfirm")
    ) {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Transaction numbers don't match !",
          labelKey: "ERR_TRASACTION_NUMBERS_DONT_MATCH"
        },
        "error"
      );
      return;
    }

    if (this.state.totalAmountToBePaid === "") {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Amount to pay can't be empty",
          labelKey: "ERR_AMOUNT_CANT_BE_EMPTY"
        },
        true
      );
      return;
    }

    if (!get(prepareFormData, "Receipt[0].Bill[0].paidBy")) {
      set(
        prepareFormData,
        "Receipt[0].Bill[0].paidBy",
        get(prepareFormData, "Receipt[0].Bill[0].payerName")
      );
    }

    try {
      showSpinner();
      const getReceipt = await httpRequest(
        "collection-services/receipts/_create", //todo Consumer code uniqueness
        "_create",
        [],
        formData,
        []
      );
      hideSpinner();
      if (getReceipt && getReceipt.Receipt && getReceipt.Receipt.length) {
        set(prepareFormData, "Receipt[0].Bill", []);
        set(prepareFormData, "Receipt[0].instrument", {}); // Clear prepareFormData
        hideSpinner();
        this.setState({ nextButtonEnabled: true });
        this.props.history.push(
          `payment-success/${propertyId}/${tenantId}/${assessmentNumber}/${assessmentYear}`
        );
      } else {
      }
    } catch (e) {
      console.log(e);
      set(prepareFormData, "Receipt[0].Bill", []);
      set(prepareFormData, "Receipt[0].instrument", {});
      hideSpinner();
      this.props.history.push(
        `payment-failure/${propertyId}/${tenantId}/${assessmentNumber}/${assessmentYear}`
      );
    } finally {
    }
  };
  //
  // estimate = async () => {
  //   let { form, common, showSpinner, hideSpinner } = this.props;
  //   let prepareFormData = { ...this.props.prepareFormData };
  //
  //   showSpinner();
  //   if (
  //     get(
  //       prepareFormData,
  //       "Properties[0].propertyDetails[0].institution",
  //       undefined
  //     )
  //   )
  //     delete prepareFormData.Properties[0].propertyDetails[0].institution;
  //   const financialYearFromQuery = getFinancialYearFromQuery();
  //   const selectedownerShipCategoryType = get(
  //     form,
  //     "ownershipType.fields.typeOfOwnership.value",
  //     ""
  //   );
  //   try {
  //     if (financialYearFromQuery) {
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].financialYear",
  //         financialYearFromQuery
  //       );
  //     }
  //     if (selectedownerShipCategoryType === "SINGLEOWNER") {
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].owners",
  //         getSingleOwnerInfo(this)
  //       );
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].ownershipCategory",
  //         get(
  //           common,
  //           `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
  //           "INDIVIDUAL"
  //         )
  //       );
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].subOwnershipCategory",
  //         selectedownerShipCategoryType
  //       );
  //     }
  //     if (selectedownerShipCategoryType === "MULTIPLEOWNERS") {
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].owners",
  //         getMultipleOwnerInfo(this)
  //       );
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].ownershipCategory",
  //         get(
  //           common,
  //           `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
  //           "INDIVIDUAL"
  //         )
  //       );
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].subOwnershipCategory",
  //         selectedownerShipCategoryType
  //       );
  //     }
  //     if (
  //       selectedownerShipCategoryType.toLowerCase().indexOf("institutional") !==
  //       -1
  //     ) {
  //       const { instiObj, ownerArray } = getInstituteInfo(this);
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].owners",
  //         ownerArray
  //       );
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].institution",
  //         instiObj
  //       );
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].ownershipCategory",
  //         get(form, "ownershipType.fields.typeOfOwnership.value", "")
  //       );
  //       set(
  //         prepareFormData,
  //         "Properties[0].propertyDetails[0].subOwnershipCategory",
  //         get(form, "institutionDetails.fields.type.value", "")
  //       );
  //     }
  //     const propertyDetails = normalizePropertyDetails(
  //       prepareFormData.Properties,
  //       this
  //     );
  //
  // //     const finalyr=getFinalData();
  // //     const financialYears=finalyr[0].financialYear;
  // // propertyDetails[0].propertyDetails[0]["financialYear"]=financialYears;
  // // console.log("propertyDetails:",propertyDetails);
  //     let estimateResponse = await httpRequest(
  //       "pt-calculator-v2/propertytax/_estimate",
  //       "_estimate",
  //       [],
  //       {
  //         CalculationCriteria: [
  //           {
  //             assessmentYear: financialYearFromQuery,
  //             tenantId:
  //               prepareFormData.Properties[0] &&
  //               prepareFormData.Properties[0].tenantId,
  //             property: propertyDetails[0]
  //           }
  //         ]
  //       }
  //     );
  //     const tenantId =
  //       prepareFormData.Properties[0] && prepareFormData.Properties[0].tenantId;
  //     const calculationScreenData = await getCalculationScreenData(
  //       get(estimateResponse, "Calculation[0].billingSlabIds", []),
  //       tenantId,
  //       this
  //     );
  //     this.setState({ calculationScreenData: calculationScreenData.data });
  //     return estimateResponse;
  //   } catch (e) {
  //     if (e.message) {
  //       alert(e.message);
  //     } else
  //       this.props.toggleSnackbarAndSetText(
  //         true,
  //         {
  //           labelName: "Error calculating tax!",
  //           labelKey: "ERR_ERROR_CALCULATING_TAX"
  //         },
  //         "error"
  //       );
  //   } finally {
  //     hideSpinner();
  //   }
  // };
  createAndUpdate = async index => {
    const { selected, formValidIndexArray, demands = [] } = this.state;
    const financialYearFromQuery = getFinancialYearFromQuery();
    let {
      form,
      common,
      location,
      showSpinner,
      hideSpinner,
      DemandProperties,
      DemandPropertiesResponse = [],
      generalMDMSDataById
    } = this.props;
    const { search } = location;
    let { resetForm } = this;
    const propertyId = getQueryValue(search, "propertyId");
    const assessmentId = getQueryValue(search, "assessmentId");
    const propertyMethodAction = !!propertyId ? "_update" : "_create";
    let prepareFormData = { ...this.props.prepareFormData };

    if (
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        undefined
      )
    )
      delete prepareFormData.Properties[0].propertyDetails[0].institution;
    const selectedownerShipCategoryType = get(
      form,
      "ownershipType.fields.typeOfOwnership.value",
      ""
    );
    if(propertyMethodAction ==="_update")
        {
          set(prepareFormData, "Properties[0].additionalDetails.updatedByULB","true");
        }
      
    if (financialYearFromQuery) {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].financialYear",
        financialYearFromQuery
      );
    }


    if (!!propertyId) {
      set(prepareFormData, "Properties[0].propertyId", propertyId);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].assessmentNumber",
        assessmentId
      );
    }
    if (selectedownerShipCategoryType.includes("SINGLEOWNER")) {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getSingleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
        get(
          prepareFormData,
          "Properties[0].propertyDetails[0].owners[0].mobileNumber"
        )
      );
    } else if (selectedownerShipCategoryType.includes("MULTIPLEOWNERS")) {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getMultipleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
        get(
          prepareFormData,
          "Properties[0].propertyDetails[0].owners[0].mobileNumber"
        )
      );
    } else {
      const { instiObj, ownerArray } = getInstituteInfo(this);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        ownerArray
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        instiObj
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(form, "ownershipType.fields.typeOfOwnership.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        get(form, "institutionDetails.fields.type.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
        get(
          form,
          "institutionAuthority.fields.mobile.value",
          get(form, "institutionAuthority.fields.telephone.value", null)
        )
      );
      let phoneNo = get(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.mobileNumber"
      );
      if (!phoneNo) {
        set(
          prepareFormData,
          "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
          get(
            prepareFormData,
            "Properties[0].propertyDetails[0].owners[0].mobileNumber"
          )
        );
      }
    }
    try {
      showSpinner();
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.name",
        get(prepareFormData, "Properties[0].propertyDetails[0].owners[0].name")
      );
      const properties = normalizePropertyDetails(
        prepareFormData.Properties,
        this
      );

      const finalyears = getFinalData();
      const finalPropertyData = [];
      const propertyDetails = DemandProperties[0].propertyDetails;
      const demandsData = propertyDetails[0].demand;
      demandsData.forEach((propertyData, index) => {
        if (propertyData) {
          let yeardatas = Object.keys(propertyData.demand).map(
            (yeardata, ind) => yeardata
          )[0];
          finalPropertyData.push({
            ...properties[0].propertyDetails[0],
            financialYear: yeardatas,
            source: "LEGACY_RECORD",
            assessmentDate: new Date().getTime()
          });
        }
      });
      properties[0].propertyDetails = finalPropertyData;

      showSpinner();
      let createPropertyResponse = await httpRequest(
        `pt-services-v2/property/${propertyMethodAction}`,
        `${propertyMethodAction}`,
        [],
        {
          Properties: properties
        }
      );
      hideSpinner();
     showSpinner();
     

       let createDemandResponse = await httpRequest(
        `billing-service/demand/${propertyMethodAction}`,
        `${propertyMethodAction}`,
        propertyMethodAction == "create"
          ? []
          : [
              {
                key: "tenantId",
                value: getTenantId()
              },
              {
                key: "consumerCode",
                value: getQueryValue(search, "propertyId")
              }
            ],
        {
          Demands: demandData
        }
      );
      hideSpinner();
      this.setState({
        assessedPropertyDetails: createPropertyResponse,
        assessedDemandDetails: createDemandResponse,
        // selected: index,
        formValidIndexArray: [...formValidIndexArray, selected]
      });
    
   


      
      hideSpinner();
      const callToggleBarSnackbar = (labelKey, labelName, status = "error") => {
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName,
            labelKey
          },
          status
        );
        resetForm();
      };
      switch (propertyMethodAction) {
        case "_update":
          this.setState({
            selected: index
          });
          break;
        case "_create":
          this.setState({
            selected: index
          });
          // callToggleBarSnackbar(
          //   "PT_PROPERTY_CREATED_SUCCESSFULLY",
          //   "PropertyTax Created Successfully",
          //   "success"
          // );
          break;
        default:
      }
    } catch (e) {
      hideSpinner();
      this.setState({ nextButtonEnabled: true });
      alert(e);
    }
  };

  createDemand = async index => {
    const { selected, formValidIndexArray, demands = [] } = this.state;
    const financialYearFromQuery = getFinancialYearFromQuery();
    let {
      form,
      common,
      location,
      showSpinner,
      hideSpinner,
      DemandProperties,
      DemandPropertiesResponse = [],
      generalMDMSDataById
    } = this.props;

    const { search } = location;

    let { resetForm } = this;
    const propertyId = getQueryValue(search, "propertyId");


    showSpinner();

    const demandResponsenew = await httpRequest(
      "billing-service/demand/_search",
      "_get",
      [
        {
          key: "tenantId",
          value: getTenantId()
        },
        {
          key: "consumerCode",
          value: getQueryValue(search, "propertyId")
        }
      ]
    );

    hideSpinner();
    const propertyMethodAction = demandResponsenew.Demands.length>0? "_update" : "_create";
    const demandData = [];
    const demandDetails = [];
    const finalyears = getFinalData();
    const finalPropertyData = [];
    const propertyDetails = DemandProperties[0].propertyDetails;
    const demandsData = propertyDetails[0].demand;

   /*  demandsData.forEach((propertyData, index) => {
      if (propertyData) {
        let yeardatas = Object.keys(propertyData.demand).map(
          (yeardata, ind) => yeardata
        )[0];
        finalPropertyData.push({
          ...properties[0].propertyDetails[0],
          financialYear: yeardatas,
          source: "LEGACY_RECORD",
          assessmentDate: new Date().getTime()
        });
      }
    });
    properties[0].propertyDetails = finalPropertyData; */


    let datas = getFinalData() || [];
    let currentYearData = [];
    let fromDate;
    let toDate;
    let demandResponse = DemandPropertiesResponse
      ? DemandPropertiesResponse.Demands
        ? DemandPropertiesResponse.Demands.reverse()
        : []
      : [];
    const demandObject = {};
    let finaYr = "";
    const dmdObj = {};

    if(datas.length===0)
    {
      alert("The localstorage data is not fetched")
    }
 
    demandResponse.forEach(obj => {
      let generalmdms = Object.keys(generalMDMSDataById.TaxPeriod).map(
        (years, keys) => {
          if (
            generalMDMSDataById.TaxPeriod[years].fromDate ===
            obj.taxPeriodFrom
          ) {
            finaYr = generalMDMSDataById.TaxPeriod[years].financialYear;
          }
        }
      );
      // demandObject[finaYr]={...obj};
      obj.demandDetails = obj.demandDetails.sort(function(a, b) {
        return a.order - b.order;
      });
      demandObject[obj.taxPeriodFrom] = { ...obj };
      dmdObj[finaYr] = { ...obj };
    });
    
    showSpinner();

    const createPropertyResponse = await httpRequest(
      "property-services/property/_search",
      "_search",
      [
        {
          key: "tenantId",
          value: getTenantId()
        },
        {
          key: "propertyIds",
          value: propertyId //"PT-107-001278",
        }
      ]
    );
    hideSpinner();

    demandsData.forEach((demand, index) => {
      demand &&
        Object.keys(demand.demand).forEach((dataYear, key) => {
          const demandDetails1 = [];
          const dR = dmdObj[dataYear] || {};
          demand.demand &&
            demand.demand[dataYear].forEach((demandValue, ind) => {
              currentYearData = datas.filter(
                data => data.financialYear == dataYear
              );
              fromDate =
                currentYearData.length > 0 ? currentYearData[0].fromDate : 0;
              toDate =
                currentYearData.length > 0 ? currentYearData[0].toDate : 0;
              // const demandResponse=demandResponse.map((demandResponse,responseKey)=>{
              //   demandResponse.
              // })
              let demandDetail={};
              if (demandValue.ID) {
                demandDetail=dR.demandDetails && dR.demandDetails.filter((dD)=>{
                  return dD.id===demandValue.ID
                });
                demandDetail=demandDetail.length>0?demandDetail[0]:{};
              }
              demandDetails1.push({
                ...demandDetail,
                taxHeadMasterCode: demandValue.PT_TAXHEAD,
                taxAmount: parseInt(
                  demandValue.PT_DEMAND != "" ? demandValue.PT_DEMAND : 0
                ),
                collectionAmount: parseInt(
                  demandValue.PT_COLLECTED != ""
                    ? demandValue.PT_COLLECTED
                    : 0
                )
              });
            });

          if (dR.demandDetails) {
            for (var i = 0; i < dR.demandDetails.length; i++) {
              if (!some(demandDetails1, { id: dR.demandDetails[i].id })) {
                demandDetails1.push({
                  ...dR.demandDetails[i],
                  taxAmount:
                    dR.demandDetails[i].taxHeadMasterCode === "PT_ROUNDOFF"
                      ? 0
                      : dR.demandDetails[i].taxAmount
                });
              }
            }
          }

          demandData.push({
            ...dR,
            tenantId: getTenantId(),
            consumerCode: get(
              createPropertyResponse,
              "Properties[0].propertyId"
            ),
            consumerType: get(
              createPropertyResponse,
              "Properties[0].propertyType"
            ),
            businessService: "PT",
            taxPeriodFrom: fromDate,
            taxPeriodTo: toDate,
            payer: {
              ...get(dR, "payer", {}),
              uuid: get(
                createPropertyResponse,
                "Properties[0].owners[0].uuid"
              )
            },
            demandDetails: demandDetails1
          });
        });
    });

    // if(propertyMethodAction=== "_update"){
    //   demandData.map(obj=>{
    //
    //     if(demandObject[obj.taxPeriodFrom]!={}){
    //       obj={...demandObject[obj.taxPeriodFrom],...obj}
    //     }
    //   })
    // }

    //showSpinner();     
    let fY = localStorage.getItem('finalData')
    fY = fY && JSON.parse(fY);
    let assessmentsData = this.props.Assessments;
   let assessment = {
      tenantId: getTenantId(),
      id:assessmentsData && assessmentsData[0] && assessmentsData[0].id,
      assessmentNumber:assessmentsData && assessmentsData[0] && assessmentsData[0].assessmentNumber,
      propertyId: propertyId,
      financialYear:fY && fY[0].financialYear,
      assessmentDate: new Date().getTime() - 60000,
      source: "LEGACY_RECORD",
      channel: "CFC_COUNTER",
      status: "ACTIVE",
      additionalDetails :{"RequestInfo": {"tt":"tt"},
        "Demands": demandData,
        "reassement": getQueryValue(search, "assessment")? true: false,
      }
    } 
   //let  propertyMethodAction ="_create";
    try {
      showSpinner();
      let assessPropertyResponse = await httpRequest(
        `property-services/assessment/${propertyMethodAction}`,
        `${propertyMethodAction}`,
        [],
        {
          Assessment: assessment
        }
      );
      hideSpinner();      

      const assessmentNumber= get(assessPropertyResponse, "Assessments[0].assessmentNumber",'');
      
      switch (propertyMethodAction) {
        case "_update":
          this.setState({
            selected: index
          });
          break;
        case "_create":
          this.setState({
            selected: index
          });         
          break;
        default:
      }
    
    } catch (e) {
      hideSpinner();
      this.setState({ nextButtonEnabled: true });
      alert(e);
  }  

 
  };
  pay = async () => {
    const { callPGService, callDraft } = this;
    const financialYearFromQuery = getFinancialYearFromQuery();
    let { form, common, location, hideSpinner } = this.props;
    const { search } = location;
    const { assessedPropertyDetails = {} } = this.state;
    const { Properties = [] } = assessedPropertyDetails;
    let propertyUID = get(assessedPropertyDetails, "Properties[0].propertyId");
    let propertyId = getQueryValue(search, "propertyId");
    if (!propertyId) {
      propertyId = propertyUID;
    }
    const assessmentId = getQueryValue(search, "assessmentId");
    const tenantId = getQueryValue(search, "tenantId");
    const isCompletePayment = getQueryValue(search, "isCompletePayment");

    const propertyMethodAction = !!propertyId ? "_update" : "_create";
    let prepareFormData = { ...this.props.prepareFormData };

    if (
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        undefined
      )
    )
      delete prepareFormData.Properties[0].propertyDetails[0].institution;
    const selectedownerShipCategoryType = get(
      form,
      "ownershipType.fields.typeOfOwnership.value",
      ""
    );
    if (financialYearFromQuery) {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].financialYear",
        financialYearFromQuery
      );
    }

    if (!!propertyId) {
      set(prepareFormData, "Properties[0].propertyId", propertyId);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].assessmentNumber",
        assessmentId
      );
    }
    if (selectedownerShipCategoryType === "SINGLEOWNER") {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getSingleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
    }

    if (selectedownerShipCategoryType === "MULTIPLEOWNERS") {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        getMultipleOwnerInfo(this)
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(
          common,
          `generalMDMSDataById.SubOwnerShipCategory[${selectedownerShipCategoryType}].ownerShipCategory`,
          "INDIVIDUAL"
        )
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        selectedownerShipCategoryType
      );
    }

    set(
      prepareFormData,
      "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
      get(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners[0].mobileNumber"
      )
    );

    if (selectedownerShipCategoryType.toLowerCase().includes("institutional")) {
      const { instiObj, ownerArray } = getInstituteInfo(this);
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].owners",
        ownerArray
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].institution",
        instiObj
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].ownershipCategory",
        get(form, "ownershipType.fields.typeOfOwnership.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].subOwnershipCategory",
        get(form, "institutionDetails.fields.type.value", "")
      );
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.mobileNumber",
        get(
          form,
          "institutionAuthority.fields.mobile.value",
          get(form, "institutionAuthority.fields.telephone.value", null)
        )
      );
    }

    try {
      set(
        prepareFormData,
        "Properties[0].propertyDetails[0].citizenInfo.name",
        get(prepareFormData, "Properties[0].propertyDetails[0].owners[0].name")
      );

      if (isCompletePayment) {
        callPGService(
          propertyId,
          assessmentId,
          financialYearFromQuery,
          tenantId
        );
      } else {
        const properties = normalizePropertyDetails(
          prepareFormData.Properties,
          this
        );

        callPGService(
          get(assessedPropertyDetails, "Properties[0].propertyId"),
          get(
            assessedPropertyDetails,
            "Properties[0].propertyDetails[0].assessmentNumber"
          ),
          get(
            assessedPropertyDetails,
            "Properties[0].propertyDetails[0].financialYear"
          ),
          get(assessedPropertyDetails, "Properties[0].tenantId")
        );
      }
    } catch (e) {
      hideSpinner();
      this.setState({ nextButtonEnabled: true });
      alert(e);
    }
  };

  closeDeclarationDialogue = () => {
    this.setState({ dialogueOpen: false });
  };

  onPayButtonClick = async () => {
    const {
      isFullPayment,
      partialAmountError,
      totalAmountToBePaid
    } = this.state;
    const { showSpinner, hideSpinner } = this.props;

    if (!isFullPayment && partialAmountError) return;
    try {
      if (totalAmountToBePaid % 1 === 0) {
        //Fractions Check
        this.setState({ dialogueOpen: true });
        const { form, prepareFormData } = this.props;
        const formKeysToValidate = [
          "cardInfo",
          "cashInfo",
          "chequeInfo",
          "demandInfo"
        ];
        let modeOfPaymentExists = false;
        for (let i = 0; i < formKeysToValidate.length; i++) {
          if (Object.keys(form).indexOf(formKeysToValidate[i]) > -1) {
            modeOfPaymentExists = true;
            break;
          }
        }
        if (modeOfPaymentExists) {
          const validateArray = Object.keys(form).reduce((result, item) => {
            if (formKeysToValidate.indexOf(item) > -1) {
              result.push({
                formKey: item,
                formValid: validateForm(form[item])
              });
            }
            return result;
          }, []);

          const areFormsValid = validateArray.reduce((result, current) => {
            if (!current.formValid) {
              result = false;
            } else {
              result = true;
            }
            return result;
          }, false);

          if (areFormsValid) {
            this.setState({ nextButtonEnabled: false });
            showSpinner();
            this.pay();
          } else {
            validateArray.forEach(item => {
              if (!item.formValid) {
                this.props.displayFormErrorsAction(item.formKey);
              }
            });
          }
        } else {
          this.setState({ nextButtonEnabled: false });
          showSpinner();
          this.pay();
        }
      } else {
        alert("Amount cannot be a fraction!");
      }
    } catch (e) {
      hideSpinner();
    }
  };
  componentDidUpdate() {
    const { selected, formValidIndexArray, editDemand } = this.state;
    const { location } = this.props;
    const { search } = location;
    const mode = getQueryValue(search, "mode");

    //this.fetchdata();

    if (mode == "edit" && selected == 3 && editDemand == false) {
      this.setState({
        editDemand: true,
        selected: 4,
        formValidIndexArray: [...formValidIndexArray, 3]
      });
    }
    let proceedToPayment = Boolean(
      getQueryValue(search, "proceedToPayment").replace("false", "")
    );
    if (proceedToPayment && selected == 3) {
      this.setState({
        selected: 5,
        formValidIndexArray: [...formValidIndexArray, 5]
      });
    }
  }
  convertImgToDataURLviaCanvas = (url, callback, outputFormat) => {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  };
  downloadAcknowledgementForm = () => {
    const { assessedPropertyDetails, imageUrl } = this.state;
    const { common, app = {} } = this.props;
    const { Properties } = assessedPropertyDetails;
    const { address, propertyDetails, propertyId } = Properties[0];
    const { owners } = propertyDetails[0];
    const { localizationLabels } = app;
    const { cities, generalMDMSDataById } = common;
    const header = getHeaderDetails(
      Properties[0],
      cities,
      localizationLabels,
      true
    );
    let receiptDetails = {};
    receiptDetails = {
      address,
      propertyDetails,
      address,
      owners,
      header,
      propertyId
    };
    generateAcknowledgementForm(
      "pt-reciept-citizen",
      receiptDetails,
      generalMDMSDataById,
      imageUrl
    );
  };

  resetForm = () => {
    const {
      form,
      removeForm,
      prepareFormDataAction,
      prepareFinalObject
    } = this.props;
    resetFormWizard(form, removeForm);
    prepareFormDataAction("Properties", []);
    prepareFinalObject("DemandProperties", []);
    prepareFinalObject("DemandPropertiesResponse", []);
    this.onTabClick(0);
  };

  render() {
    const {
      renderStepperContent,
      onPayButtonClick,
      closeDeclarationDialogue
    } = this;
    const {
      selected,
      ownerInfoArr,
      formValidIndexArray,
      dialogueOpen,
      nextButtonEnabled,
      assessedPropertyDetails = {}
    } = this.state;
    const fromReviewPage = selected === 3;
    const { history, location, finalData = [], getYearList,DemandPropertiesResponse} = this.props;

   
    const { search } = location;
    const { Properties = [] } = assessedPropertyDetails;
    let propertyId = "";
    for (let pty of Properties) {
      propertyId = pty.propertyId;
    }
    const { header, subHeaderValue, headerValue } = this.getHeader(
      selected,
      search,
      propertyId
    );

    const wPropertyId = getQueryValue(search, "propertyId");
    return (
      <div className="wizard-form-main-cont">
        <div className="form-header">
          <PTHeader
            header={header}
            subHeaderTitle="PT_PROPERTY_PTUID"
            headerValue={headerValue}
            subHeaderValue={subHeaderValue}
          />
        </div>
        <WizardComponent
          downloadAcknowledgementForm={this.downloadAcknowledgementForm}
          content={renderStepperContent(selected, fromReviewPage)}
          onTabClick={this.onTabClick}
          selected={selected}
          header={getHeaderLabel(selected, "employee")}
          footer={null}
          formValidIndexArray={formValidIndexArray}
          updateIndex={this.updateIndex}
          backLabel="PT_COMMONS_GO_BACK"
          nextLabel={this.getButtonLabels(selected)}
          ownerInfoArr={ownerInfoArr}
          closeDialogue={closeDeclarationDialogue}
          dialogueOpen={dialogueOpen}
          history={history}
          onPayButtonClick={onPayButtonClick}
          nextButtonEnabled={nextButtonEnabled}
          tenantId = {getTenantId()}
          propertyId = {wPropertyId}
          demands = {DemandPropertiesResponse && DemandPropertiesResponse.Demands}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { form, common, app, screenConfiguration } = state || {};
  const { propertyAddress } = form;
  const { city } =
    (propertyAddress && propertyAddress.fields && propertyAddress.fields) || {};
  const currentTenantId = (city && city.value) || commonConfig.tenantId;
  const { generalMDMSDataById } = common;
  const yeardataInfo =
    (generalMDMSDataById && generalMDMSDataById.TaxPeriod) || {};
  let { Assessments = [] } = state.properties || {}; 

  const getYearList = yeardataInfo && Object.values(yeardataInfo);

  const taxDataInfo =
    (generalMDMSDataById && generalMDMSDataById.TaxHeadMaster) || {};
  let yeardata = [];
  let taxData = [];
  const data = Object.keys(yeardataInfo).map((key, index) => {
    yeardata.push(yeardataInfo[key]);
  });
  const data2 = Object.keys(taxDataInfo).map((key, index) => {
    taxData.push(taxDataInfo[key]);
  });
  let yeardata1 = yeardata.filter(yearKey => yearKey.service === "PT");
  let taxdata1 =
    taxData.filter(tax => tax.service === "PT" && tax.legacy == true) || [];
  taxdata1.length > 0 &&
    taxdata1.sort(function(a, b) {
      return a.order - b.order;
    });
  const finalData = Object.keys(yeardata1).map((data, key) => {
    yeardata1[data]["taxHead"] = [...taxdata1];
    return yeardata[data];
  });
  {
    finalData && finalData.length
      ? localStorage.setItem("finalData", JSON.stringify(finalData))
      : "error";
  }
  let { preparedFinalObject = {} } = screenConfiguration;
  preparedFinalObject = { ...preparedFinalObject };
  const { DemandProperties, DemandPropertiesResponse } =
    preparedFinalObject || {};
    const {cities}=common;
  return {
    form,
    currentTenantId,
    prepareFormData: common.prepareFormData,
    common,
    getYearList,
    app,
    generalMDMSDataById,
    DemandProperties,
    DemandPropertiesResponse,
    cities,
    Assessments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteForm: formKey => dispatch(deleteForm(formKey)),
    setRoute: route => dispatch(setRoute(route)),
    displayFormErrorsAction: formKey => dispatch(displayFormErrors(formKey)),
    updatePTForms: forms => dispatch(updateForms(forms)),
    showSpinner: () => dispatch(showSpinner()),
    hideSpinner: () => dispatch(hideSpinner()),
    fetchGeneralMDMSData: (
      requestBody,
      moduleName,
      masterName,
      key,
      tenantId
    ) =>
      dispatch(
        fetchGeneralMDMSData(requestBody, moduleName, masterName, key, tenantId)
      ),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    generalMDMSFetchSuccess: (payload, moduleName, masterArray) =>
      dispatch(generalMDMSFetchSuccess(payload, moduleName, masterArray)),
    fetchMDMDDocumentTypeSuccess: data =>
      dispatch(fetchMDMDDocumentTypeSuccess(data)),
    updatePrepareFormDataFromDraft: prepareFormData =>
      dispatch(updatePrepareFormDataFromDraft(prepareFormData)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    removeForm: formkey => dispatch(removeForm(formkey)),
    prepareFormDataAction: (path, value) =>
      dispatch(prepareFormDataAction(path, value)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
    fetchAssessments: (fetchAssessmentsQueryObject) => 
      dispatch(fetchAssessments(fetchAssessmentsQueryObject)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormWizardDataEntry);
