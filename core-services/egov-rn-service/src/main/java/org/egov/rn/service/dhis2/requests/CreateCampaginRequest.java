package org.egov.rn.service.dhis2.requests;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.egov.rn.service.DHIS2Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateCampaginRequest {
    @JsonProperty("campaginName")
    String campaginName;

    @JsonProperty("displayCampaginName")
    String displayCampaginName;

    @JsonProperty("campaginIndicators")
    private List<String> campaginIndicators;

    public List<String> getCampaginLegends() {
        return campaginLegends;
    }

    public void setCampaginLegends(List<String> campaginLegends) {
        this.campaginLegends = campaginLegends;
    }

    @JsonProperty("campaginLegends")
    private List<String> campaginLegends;

    public ArrayList<String> getFormFields() {
        return formFields;
    }

    public void setFormFields(ArrayList<String> formFields) {
        this.formFields = formFields;
    }

    @JsonProperty("campaginFormFields")
    ArrayList<String> formFields;

    public String getCampaginCategoryComboId() {
        return campaginCategoryComboId;
    }

    public void setCampaginCategoryComboId(String campaginCategoryComboId) {
        this.campaginCategoryComboId = campaginCategoryComboId;
    }

    @JsonProperty("campaginCategoryComboId")
    String campaginCategoryComboId;

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

    public List<String> getCampaginIndicators() {
        return campaginIndicators;
    }

    public void setCampaginIndicators(List<String> campaginIndicators) {
        this.campaginIndicators = campaginIndicators;
    }

    public DHis2Dataset getDHISRequest(RestTemplate restTemplate){
        DHis2Dataset datasetRequest = new DHis2Dataset();
        datasetRequest.setDisplayName(this.getCampaginName());
        datasetRequest.setDisplayShortName(this.getCampaginName());
        datasetRequest.setName(this.getCampaginName());
        datasetRequest.setShortName(this.getCampaginName());
        datasetRequest.setDisplayFormName(this.getDisplayCampaginName());
        datasetRequest.setFormType("DEFAULT");
        datasetRequest.setPeriodType(this.getCampaginPeriodType());
        datasetRequest.setPublicAccess("rw------");
        datasetRequest.setSkipOffline(false);
        datasetRequest.setValidCompleteOnly(false);
        datasetRequest.setCompulsoryFieldsCompleteOnly(false);
        datasetRequest.setVersion(1);
        datasetRequest.setFavorite(false);
        datasetRequest.setDimensionItemType("REPORTING_RATE");
        datasetRequest.setDataElementDecoration(false);
        datasetRequest.setNotifyCompletingUser(false);
        datasetRequest.setNoValueRequiresComment(false);
        datasetRequest.setExternalAccess(false);
        datasetRequest.setFieldCombinationRequired(true);
        datasetRequest.setRenderHorizontally(false);
        datasetRequest.setRenderAsTabs(false);
        datasetRequest.setMobile(false);
        datasetRequest.setTimelyDays(this.getCampaignTimelyDays());
        datasetRequest.setOpenFuturePeriods(this.getCampaignOpenFuturePeriods());
        datasetRequest.setOpenPeriodsAfterCoEndDate(this.getCampaignOpenPeriodsAfterCoEndDate());
        datasetRequest.setExpiryDays(this.getCampaignExpiryDays());
        List<OrganisationUnit> organisationUnits = new ArrayList<OrganisationUnit>(
                Arrays.asList(new OrganisationUnit().withId("LJX5GuypkKy"))
        );
        datasetRequest.setOrganisationUnits(organisationUnits);

        CategoryCombo categoryCombo = new CategoryCombo();
        categoryCombo.setId(this.getCampaginCategoryComboId());

        datasetRequest.setCategoryCombo(categoryCombo);


        List<LegendSet> legendSets = new ArrayList<LegendSet>();
        this.getCampaginLegends().forEach(id -> {
            LegendSet legendSet = new LegendSet().withAdditionalProperty("id",id);
            legendSets.add(legendSet);
        });

        datasetRequest.setLegendSets(legendSets);

        List<Indicator> indicators = new ArrayList<Indicator>();
        this.getCampaginIndicators().forEach(id -> {
            Indicator indicator = new Indicator().withAdditionalProperty("id",id);
            indicators.add(indicator);
        });

        datasetRequest.setIndicators(indicators);

        List<DataSetElement> dataSetElements = new ArrayList<DataSetElement>();
        this.getFormFields().forEach(dataSetElement -> {

            // GET REVERSE MAPPING
            String dhis2FormId = new DHIS2Service(restTemplate).getDhis2FormId(dataSetElement);
            DataSetElement dse = new DataSetElement().withAdditionalProperty("dataElement",new DataElement().withAdditionalProperty("id",dhis2FormId));
            dataSetElements.add(dse);
        });
        datasetRequest.setDataSetElements(dataSetElements);
        return datasetRequest;
    }
}
