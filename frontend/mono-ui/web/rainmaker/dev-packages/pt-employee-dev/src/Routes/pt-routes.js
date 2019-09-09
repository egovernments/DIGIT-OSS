import React from "react";
import Loadable from "react-loadable";

const Loading = () => <div />;

const PTHome = Loadable({
  loader: () => import("../Screens/PTHome"),
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

// const redirectionUrl = "/user/login";

const routes = [
  // property tax routes
  {
    path: "property-tax",
    component: PTHome,
    needsAuthentication: true,
    options: {
      title: "PT_HOME_PROPERTY_TAX",
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
      title: "PT_SEARCH_PROPERTY_TITLE"
      // hideBackButton: true,
    }
  },
  {
    path: "property-tax/property/:propertyId/:tenantId",
    component: Property,
    needsAuthentication: true,
    options: {
      hideFooter: true
      // hideBackButton: true,
    }
  },

  {
    path: "property-tax/assessment-form",
    component: FormWizard,
    needsAuthentication: true,
    options: {
      hideFooter: true
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
  }
];

export default routes;
