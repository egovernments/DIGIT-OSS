import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonContainer, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadFullCertDetails} from "./../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {getFullBirthCertDetailsCard} from "./fullBirthCertDetailsCard";
import {getFullDeathCertDetailsCard} from "./fullDeathCertDetailsCard";


const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const fullViewCertificate = {
  uiFramework: "material-ui",
  name: "fullViewCertificate",
  beforeInitScreen:(action, state, dispatch) => {

    let tenantId = getQueryArg(window.location.href, "tenantId");
    let id = getQueryArg(window.location.href, "certificateId");
    let module = getQueryArg(window.location.href, "module");

    let data = {tenantId:tenantId, id:id, module:module};
    
    loadFullCertDetails(action, state, dispatch, data).then((response) => {
      //response = {BirthCertificate:[{"birthFatherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"birthMotherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"birthPresentaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"birthPermaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"registrationno":"test","hospitalname":"VAIJAYANTI HOSPITAL","dateofreportepoch":"2021-03-16","dateofbirthepoch":"2021-03-11","genderStr":"Male","firstname":"TEst","middlename":"TEst","lastname":"TEst","placeofbirth":"TEst","informantsname":"TEst","informantsaddress":"TEst","remarks":"asdf"}]};
      //response = {DeathCertificate:[{"deathFatherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"deathMotherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"deathPresentaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"deathPermaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"registrationno":"test","hospitalname":"VAIJAYANTI HOSPITAL","dateofreportepoch":"2021-03-16","dateofdeathepoch":"2021-03-11","genderStr":"Male","firstname":"TEst","middlename":"TEst","lastname":"TEst","placeofdeath":"TEst","informantsname":"TEst","informantsaddress":"TEst","remarks":"asdf"}]};
      if (module=="birth" && response && response.BirthCertificate && response.BirthCertificate.length>0) {
        dispatch(prepareFinalObject("bnd.viewFullCertDetails", response.BirthCertificate[0]));
      }
      else
      if (module=="death" && response && response.DeathCertificate && response.DeathCertificate.length>0) {
        dispatch(prepareFinalObject("bnd.viewFullCertDetails", response.DeathCertificate[0]));
      }
    });

    return action;

  },

  components:{
    div1: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      visible:getQueryArg(window.location.href, "module")=="birth",
      props: {
        disableValidation: true,
      },
      children: {
        details: getFullBirthCertDetailsCard("bnd.viewFullCertDetails")
      }
    },
    div2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      visible:getQueryArg(window.location.href, "module")=="death",
      props: {
        disableValidation: true,
      },
      children: {
        details: getFullDeathCertDetailsCard("bnd.viewFullCertDetails")
      }
    }
  }
}


export default fullViewCertificate;
