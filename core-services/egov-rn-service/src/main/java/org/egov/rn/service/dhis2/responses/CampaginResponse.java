package org.egov.rn.service.dhis2.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.egov.rn.service.dhis2.requests.*;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CampaginResponse {
    @JsonProperty("campaginName")
    String campaginName;

    @JsonProperty("displayCampaginName")
    String displayCampaginName;

    @JsonProperty("campaginIndicators")
    private List<Indicator> campaginIndicators;

    public List<LegendSet> getCampaginLegends() {
        return campaginLegends;
    }

    public void setCampaginLegends(List<LegendSet> campaginLegends) {
        this.campaginLegends = campaginLegends;
    }

    @JsonProperty("campaginLegends")
    private List<LegendSet> campaginLegends;

    public List<DataSetElement> getFormFields() {
        return formFields;
    }

    public void setFormFields(List<DataSetElement> formFields) {
        this.formFields = formFields;
    }

    @JsonProperty("campaginFormFields")
    List<DataSetElement> formFields;

    public CategoryCombo getCampaginCategoryComboId() {
        return campaginCategoryComboId;
    }

    public void setCampaginCategoryComboId(CategoryCombo campaginCategoryComboId) {
        this.campaginCategoryComboId = campaginCategoryComboId;
    }

    @JsonProperty("campaginCategoryComboId")
    CategoryCombo campaginCategoryComboId;

    public Integer getCampaignTimelyDays() {
        return campaignTimelyDays;
    }

    public void setCampaignTimelyDays(Integer campaignTimelyDays) {
        this.campaignTimelyDays = campaignTimelyDays;
    }

    @JsonProperty("campaignTimelyDays")
    Integer campaignTimelyDays;

    public Integer getCampaignOpenPeriodsAfterCoEndDate() {
        return campaignOpenPeriodsAfterCoEndDate;
    }

    public void setCampaignOpenPeriodsAfterCoEndDate(Integer campaignOpenPeriodsAfterCoEndDate) {
        this.campaignOpenPeriodsAfterCoEndDate = campaignOpenPeriodsAfterCoEndDate;
    }

    public Integer getCampaignOpenFuturePeriods() {
        return campaignOpenFuturePeriods;
    }

    public void setCampaignOpenFuturePeriods(Integer campaignOpenFuturePeriods) {
        this.campaignOpenFuturePeriods = campaignOpenFuturePeriods;
    }

    public Integer getCampaignExpiryDays() {
        return campaignExpiryDays;
    }

    public void setCampaignExpiryDays(Integer campaignExpiryDays) {
        this.campaignExpiryDays = campaignExpiryDays;
    }

    @JsonProperty("campaignOpenPeriodsAfterCoEndDate")
    Integer campaignOpenPeriodsAfterCoEndDate;

    @JsonProperty("campaignOpenFuturePeriods")
    Integer campaignOpenFuturePeriods;

    @JsonProperty("campaignExpiryDays")
    Integer campaignExpiryDays;

    public String getCampaginPeriodType() {
        return campaginPeriodType;
    }

    public void setCampaginPeriodType(String campaginPeriodType) {
        this.campaginPeriodType = campaginPeriodType;
    }

    @JsonProperty("campaginPeriodType")
    String campaginPeriodType;

    public String getDisplayCampaginName() {
        return displayCampaginName;
    }

    public void setDisplayCampaginName(String displayCampaginName) {
        this.displayCampaginName = displayCampaginName;
    }

    public String getCampaginName() {
        return campaginName;
    }

    public void setCampaginName(String campaginName) {
        this.campaginName = campaginName;
    }

    public List<Indicator> getCampaginIndicators() {
        return campaginIndicators;
    }

    public void setCampaginIndicators(List<Indicator> campaginIndicators) {
        this.campaginIndicators = campaginIndicators;
    }

}
