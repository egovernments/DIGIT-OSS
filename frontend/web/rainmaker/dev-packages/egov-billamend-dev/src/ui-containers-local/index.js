import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;


const EstimateCardContainer = Loadable({
  loader: () => import("./EstimateCardContainer"),
  loading: () => <Loading />
});

const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});

const AdjustmentAmountContainer = Loadable({
  loader: () => import("./AdjustmentAmountContainer"),
  loading: () => <Loading />
});

const CheckBoxContainer = Loadable({
  loader: () => import("./CheckBoxContainer"),
  loading: () => <Loading />
});
const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});
const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});

export {
  EstimateCardContainer,
  DocumentListContainer,
  AdjustmentAmountContainer,
  CheckBoxContainer,
  DialogContainer,
  AutosuggestContainer
};
