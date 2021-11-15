import React from "react";
import { Label } from "egov-ui-framework/ui-atoms";
import get from "lodash/get";
import { connect } from "react-redux";
import { getLocaleLabels, appendModulePrefix, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocalization, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import isEmpty from "lodash/isEmpty";
import "./index.css";

// const locale = getLocale() || "en_IN";
// const localizationLabelsData = initLocalizationLabels(locale);

class LabelContainer extends React.Component {
	render() {
		let {
			labelName,
			labelKey,
			localePrefix,
			fieldValue,
			isVisibleLabel,
			localizationLabels,
			dynamicArray,
			checkValueForNA,
			visibility = true,
			...rest
		} = this.props;
		let translatedLabel = getLocaleLabels(
			labelName,
			labelKey,
			localizationLabels
		);

		if (dynamicArray) {
			if (dynamicArray.length > 1) {
				dynamicArray.forEach((item, index) => {
					translatedLabel = translatedLabel.replace(
						new RegExp("\\{" + index + "\\}", "gm"),
						item
					);
				});
			} else {
				let index = 0;
				translatedLabel = translatedLabel.replace(
					new RegExp("\\{" + index + "\\}", "gm"),
					dynamicArray[0]
				);
			}
		}

		if (typeof fieldValue === "boolean") {
			fieldValue = fieldValue ? getLocaleLabels("SCORE_YES", "SCORE_YES") : getLocaleLabels("SCORE_NO", "SCORE_NO");
		}

		let fieldLabel =
			typeof fieldValue === "string"
				? getLocaleLabels(
					fieldValue,

					localePrefix && !isEmpty(localePrefix)
						? appendModulePrefix(fieldValue, localePrefix)
						: fieldValue,
					localizationLabels
				)
				: fieldValue;
		let labelValue = fieldValue ;
		let lebelName = translatedLabel
		labelValue =
			checkValueForNA && typeof checkValueForNA === "function"
				? checkValueForNA(labelValue)
				: labelValue;
		
		let isMode = getQueryArg(window.location.href, "mode");
		isMode = (isMode) ? isMode.toUpperCase() : "";
		let classname = (isMode === "WORKFLOWEDIT" && isVisibleLabel && labelValue && labelValue !== "NA") ? "show-label" :  "hide-label" ;   
		return (
			<React.Fragment>
				<Label
					className={classname}
					data-localization={
						labelKey ? labelKey : labelName ? labelName : fieldLabel
					}
					// label={lebelName}
					label={"Old value: "}
					{...rest}
				/>
				<Label
					className={classname}
					label={labelValue}
					{...rest}
				/>

			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, ownprops) => {
	let fieldValue = "",isVisibleLabel = false;
	const { localizationLabels } = state.app;
	let { jsonPath, callBack, value, oldValue } = ownprops;
	if(jsonPath === 'gender'){
		value = value && value.toUpperCase();
		oldValue = oldValue && oldValue.toUpperCase();
	}
	if (oldValue) {
		 if(value !== oldValue){
			isVisibleLabel = true;
			fieldValue = oldValue;
		}
	}
	return { fieldValue, isVisibleLabel, localizationLabels };
};

export default connect(
	mapStateToProps,
	{}
)(LabelContainer);
