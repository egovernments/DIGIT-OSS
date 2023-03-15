import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonContainer, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadCertDetails} from "./../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {getBirthCertDetailsCard} from "./birthCertDetailsCard";
import {getDeathCertDetailsCard} from "./deathCertDetailsCard";


const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const viewCertificate = {
  uiFramework: "material-ui",
  name: "viewCertificate",
  beforeInitScreen:(action, state, dispatch) => {

    let tenantId = getQueryArg(window.location.href, "tenantId");
    let id = getQueryArg(window.location.href, "id");
    let birthcertificateno = getQueryArg(window.location.href, "birthcertificateno");
    let deathcertificateno = getQueryArg(window.location.href, "deathcertificateno");
    let module = getQueryArg(window.location.href, "module");

    let data = {tenantId:tenantId, id:id, birthcertificateno: birthcertificateno, deathcertificateno:deathcertificateno, module:module};
    
    loadCertDetails(action, state, dispatch, data).then((response) => {
      if (module=="birth" && response && response.BirthCertificate && response.BirthCertificate.length>0) {
        dispatch(prepareFinalObject("bnd.viewCertDetails", response.BirthCertificate[0]));
      }
      else
      if (module=="death" && response && response.DeathCertificate && response.DeathCertificate.length>0) {
        dispatch(prepareFinalObject("bnd.viewCertDetails", response.DeathCertificate[0]));
      }
    });

    return action;

  },

  components:{
    mainDiv: getCommonCard({
        caption2: getCommonCaption({
          labelName: "NOTE",
          labelKey: "BND_NOTE_VIEW_CERTIFICATE"
        }),
        divider1: getDivider(),
        header: getCommonSubHeader(
          {
            labelName: "Certificate",
            labelKey: "BND_CERTIFICATE_DETAILS"
          },
          {
            style: {
              marginBottom: 18
            }
          }
        ),
        div1: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          visible:getQueryArg(window.location.href, "module")=="birth",
          props: {
            disableValidation: true,
          },
          children: {
            details: getBirthCertDetailsCard("bnd.viewCertDetails")
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
            details: getDeathCertDetailsCard("bnd.viewCertDetails")
          }
        }
      })
    }
  }


export default viewCertificate;
