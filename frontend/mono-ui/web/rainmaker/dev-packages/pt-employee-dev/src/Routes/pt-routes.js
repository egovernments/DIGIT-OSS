import React from "react";
import Loadable from "react-loadable";

const Loading = () => <div />;

const PTHome = Loadable({
  loader: () => import("../Screens/PTHome"),
  loading: Loading
});
const ApplicationPreview = Loadable({
  loader: () => import("egov-ui-kit/common/propertyTax/ApplicationPreview"),
  loading: Loading
});
const HowItWorks = Loadable({
  loader: () => import("egov-ui-kit/common/propertyTax/HowItWorks"),
  loading: Loading
});
const PTExamples = Loadable({
  loader: () => import("egov-ui-kit/common/propertyTax/PTExample"),
  loading: Loading
});
const SearchProperty = Loadable({
  loader: () => import("../Screens/SearchProperty"),
  loading: Loading
});
const Property = Loadable({
  loader: () => import("egov-ui-kit/common/propertyTax/Property"),
  loading: Loading
});
const FormWizard = Loadable({
  loader: () => import("../Screens/FormWizard"),
  loading: Loading
});
const PaymentSuccess = Loadable({
  loader: () => import("../Screens/PaymentSuccess"),
  loading: Loading
});
const PaymentFailure = Loadable({
  loader: () => import("../Screens/PaymentFailure"),
  loading: Loading
});
const PropertyInformationForm = Loadable({
  loader: () => import("../Screens/PropertyEditForm"),
  loading: Loading
});

const ptAcknowledgment = Loadable({
  loader: () => import("egov-ui-kit/common/propertyTax/PTAcknowledgement"),
  loading: Loading
});

// const redirectionUrl = "/user/login";

const routes = [
  // property tax routes
  {
    path: "property-tax",
    // component: PTHome,
    component: SearchProperty,
    needsAuthentication: true,
    options: {
      title: "PT_HOME_PROPERTY_TAX",
      hideTitle: true,
      hideFooter: true
      // hideBackButton: true,
      // isHomeScreen: true,
    }
  },
  {
    path: "property-tax/search-property",
    component: SearchProperty,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "PT_HOME_PROPERTY_TAX",
      hideTitle:true,
      // hideBackButton: true,
    }
  },
  {
    path: "property-tax/property/:propertyId/:tenantId",
    component: Property,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle:true,
      // hideBackButton: true,
    }
  },
  {
    path: "property-tax/application-preview",
    component: ApplicationPreview,
    needsAuthentication: true,
    options: {
      // hideTitle:true,
      hideFooter: true,
      hideTitle: true
      // hideBackButton: true,
    }
  },
  {
    path: "property-tax/assessment-form",
    component: FormWizard,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle:true
      // hideBackButton: true,
    }
  },
  {
    path:
      "property-tax/payment-success/:propertyId/:tenantId/:assessmentId/:assessmentYear",
    component: PaymentSuccess,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      hideTitle: true
    }
  },
  {
    path:
      "property-tax/payment-failure/:propertyId/:tenantId/:assessmentNumber/:assessmentYear",
    component: PaymentFailure,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      hideTitle: true
    }
  },
  {
    path: "property-tax/property/:propertyId/:tenantId/edit-property",
    component: PropertyInformationForm,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      hideTitle: true
    }
  },
  {
    path: "property-tax/how-it-works",
    component: HowItWorks,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      // hideBackButton: true,
      title: "PT_HOW_IT_WORKS"
    }
  },
  {
    path: "property-tax/pt-examples",
    component: PTExamples,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      // hideBackButton: true,
      title: "PT_EXAMPLES"
    }
  },
  {
    path: "property-tax/pt-acknowledgment",
    component: ptAcknowledgment,
    needsAuthentication: true,
    options: {
      hideFooter: false,
      hideTitle: true,
      // hideBackButton: true,
      // title: "PT_ACKNOWLEDGEMENT"
    }
  }
];

export default routes;
