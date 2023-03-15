import withAuthorization from "egov-ui-kit/hocs/withAuthorization";
import withoutAuthorization from "egov-ui-kit/hocs/withoutAuthorization";
import pgrRoutes from "./pgr-routes";

const mapRoutes = routes => {
  return routes.map((route, index) => {
    const { component, options, redirectionUrl, needsAuthentication } = route;
    return {
      ...route,
      component: needsAuthentication
        ? withAuthorization(options)(component)
        : withoutAuthorization(redirectionUrl)(component)
    };
  });
};

const routes = { pgr: mapRoutes(pgrRoutes) };
export default routes;
