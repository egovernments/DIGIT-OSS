
package org.egov.rn.service.dhis2.requests;

import com.fasterxml.jackson.annotation.*;
import org.egov.rn.service.dhis2.responses.CampaginResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DHis2Dataset {

    @JsonProperty("name")
    private String name;
    @JsonProperty("shortName")
    private String shortName;
    @JsonProperty("validCompleteOnly")
    private boolean validCompleteOnly;
    @JsonProperty("publicAccess")
    private String publicAccess;
    @JsonProperty("skipOffline")
    private boolean skipOffline;
    @JsonProperty("compulsoryFieldsCompleteOnly")
    private boolean compulsoryFieldsCompleteOnly;
    @JsonProperty("formType")
    private String formType;
    @JsonProperty("version")
    private int version;
    @JsonProperty("displayFormName")
    private String displayFormName;
    @JsonProperty("timelyDays")
    private int timelyDays;
    @JsonProperty("favorite")
    private boolean favorite;
    @JsonProperty("dimensionItemType")
    private String dimensionItemType;
    @JsonProperty("dataElementDecoration")
    private boolean dataElementDecoration;
    @JsonProperty("notifyCompletingUser")
    private boolean notifyCompletingUser;
    @JsonProperty("displayName")
    private String displayName;
    @JsonProperty("noValueRequiresComment")
    private boolean noValueRequiresComment;
    @JsonProperty("displayShortName")
    private String displayShortName;
    @JsonProperty("externalAccess")
    private boolean externalAccess;
    @JsonProperty("fieldCombinationRequired")
    private boolean fieldCombinationRequired;
    @JsonProperty("renderHorizontally")
    private boolean renderHorizontally;
    @JsonProperty("renderAsTabs")
    private boolean renderAsTabs;
    @JsonProperty("mobile")
    private boolean mobile;
    @JsonProperty("openPeriodsAfterCoEndDate")
    private int openPeriodsAfterCoEndDate;
    @JsonProperty("periodType")
    private String periodType;
    @JsonProperty("openFuturePeriods")
    private int openFuturePeriods;
    @JsonProperty("expiryDays")
    private int expiryDays;
    @JsonProperty("categoryCombo")
    private CategoryCombo categoryCombo;
    @JsonProperty("legendSet")
    private LegendSet legendSet;
    @JsonProperty("user")
    private User user;
    @JsonProperty("dataSetElements")
    private List<DataSetElement> dataSetElements = new ArrayList<DataSetElement>();
    @JsonProperty("dataInputPeriods")
    private List<Object> dataInputPeriods = new ArrayList<Object>();
    @JsonProperty("translations")
    private List<Object> translations = new ArrayList<Object>();
    @JsonProperty("interpretations")
    private List<Object> interpretations = new ArrayList<Object>();
    @JsonProperty("userGroupAccesses")
    private List<Object> userGroupAccesses = new ArrayList<Object>();
    @JsonProperty("attributeValues")
    private List<Object> attributeValues = new ArrayList<Object>();
    @JsonProperty("indicators")
    private List<Indicator> indicators = new ArrayList<Indicator>();
    @JsonProperty("sections")
    private List<Object> sections = new ArrayList<Object>();
    @JsonProperty("userAccesses")
    private List<Object> userAccesses = new ArrayList<Object>();
    @JsonProperty("legendSets")
    private List<LegendSet> legendSets = new ArrayList<LegendSet>();
    @JsonProperty("favorites")
    private List<Object> favorites = new ArrayList<Object>();
    @JsonProperty("compulsoryDataElementOperands")
    private List<Object> compulsoryDataElementOperands = new ArrayList<Object>();
    @JsonProperty("organisationUnits")
    private List<OrganisationUnit> organisationUnits = new ArrayList<OrganisationUnit>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();


    public DHis2Dataset() {
    }

    public DHis2Dataset(String name, String shortName, boolean validCompleteOnly, String publicAccess, boolean skipOffline, boolean compulsoryFieldsCompleteOnly, String formType, int version, String displayFormName, int timelyDays, boolean favorite, String dimensionItemType, boolean dataElementDecoration, boolean notifyCompletingUser, String displayName, boolean noValueRequiresComment, String displayShortName, boolean externalAccess, boolean fieldCombinationRequired, boolean renderHorizontally, boolean renderAsTabs, boolean mobile, int openPeriodsAfterCoEndDate, String periodType, int openFuturePeriods, int expiryDays, CategoryCombo categoryCombo, LegendSet legendSet, User user, List<DataSetElement> dataSetElements, List<Object> dataInputPeriods, List<Object> translations, List<Object> interpretations, List<Object> userGroupAccesses, List<Object> attributeValues, List<Indicator> indicators, List<Object> sections, List<Object> userAccesses, List<LegendSet> legendSets, List<Object> favorites, List<Object> compulsoryDataElementOperands, List<OrganisationUnit> organisationUnits) {
        super();
        this.name = name;
        this.shortName = shortName;
        this.validCompleteOnly = validCompleteOnly;
        this.publicAccess = publicAccess;
        this.skipOffline = skipOffline;
        this.compulsoryFieldsCompleteOnly = compulsoryFieldsCompleteOnly;
        this.formType = formType;
        this.version = version;
        this.displayFormName = displayFormName;
        this.timelyDays = timelyDays;
        this.favorite = favorite;
        this.dimensionItemType = dimensionItemType;
        this.dataElementDecoration = dataElementDecoration;
        this.notifyCompletingUser = notifyCompletingUser;
        this.displayName = displayName;
        this.noValueRequiresComment = noValueRequiresComment;
        this.displayShortName = displayShortName;
        this.externalAccess = externalAccess;
        this.fieldCombinationRequired = fieldCombinationRequired;
        this.renderHorizontally = renderHorizontally;
        this.renderAsTabs = renderAsTabs;
        this.mobile = mobile;
        this.openPeriodsAfterCoEndDate = openPeriodsAfterCoEndDate;
        this.periodType = periodType;
        this.openFuturePeriods = openFuturePeriods;
        this.expiryDays = expiryDays;
        this.categoryCombo = categoryCombo;
        this.legendSet = legendSet;
        this.user = user;
        this.dataSetElements = dataSetElements;
        this.dataInputPeriods = dataInputPeriods;
        this.translations = translations;
        this.interpretations = interpretations;
        this.userGroupAccesses = userGroupAccesses;
        this.attributeValues = attributeValues;
        this.indicators = indicators;
        this.sections = sections;
        this.userAccesses = userAccesses;
        this.legendSets = legendSets;
        this.favorites = favorites;
        this.compulsoryDataElementOperands = compulsoryDataElementOperands;
        this.organisationUnits = organisationUnits;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    public DHis2Dataset withName(String name) {
        this.name = name;
        return this;
    }

    @JsonProperty("shortName")
    public String getShortName() {
        return shortName;
    }

    @JsonProperty("shortName")
    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public DHis2Dataset withShortName(String shortName) {
        this.shortName = shortName;
        return this;
    }

    @JsonProperty("validCompleteOnly")
    public boolean isValidCompleteOnly() {
        return validCompleteOnly;
    }

    @JsonProperty("validCompleteOnly")
    public void setValidCompleteOnly(boolean validCompleteOnly) {
        this.validCompleteOnly = validCompleteOnly;
    }

    public DHis2Dataset withValidCompleteOnly(boolean validCompleteOnly) {
        this.validCompleteOnly = validCompleteOnly;
        return this;
    }

    @JsonProperty("publicAccess")
    public String getPublicAccess() {
        return publicAccess;
    }

    @JsonProperty("publicAccess")
    public void setPublicAccess(String publicAccess) {
        this.publicAccess = publicAccess;
    }

    public DHis2Dataset withPublicAccess(String publicAccess) {
        this.publicAccess = publicAccess;
        return this;
    }

    @JsonProperty("skipOffline")
    public boolean isSkipOffline() {
        return skipOffline;
    }

    @JsonProperty("skipOffline")
    public void setSkipOffline(boolean skipOffline) {
        this.skipOffline = skipOffline;
    }

    public DHis2Dataset withSkipOffline(boolean skipOffline) {
        this.skipOffline = skipOffline;
        return this;
    }

    @JsonProperty("compulsoryFieldsCompleteOnly")
    public boolean isCompulsoryFieldsCompleteOnly() {
        return compulsoryFieldsCompleteOnly;
    }

    @JsonProperty("compulsoryFieldsCompleteOnly")
    public void setCompulsoryFieldsCompleteOnly(boolean compulsoryFieldsCompleteOnly) {
        this.compulsoryFieldsCompleteOnly = compulsoryFieldsCompleteOnly;
    }

    public DHis2Dataset withCompulsoryFieldsCompleteOnly(boolean compulsoryFieldsCompleteOnly) {
        this.compulsoryFieldsCompleteOnly = compulsoryFieldsCompleteOnly;
        return this;
    }

    @JsonProperty("formType")
    public String getFormType() {
        return formType;
    }

    @JsonProperty("formType")
    public void setFormType(String formType) {
        this.formType = formType;
    }

    public DHis2Dataset withFormType(String formType) {
        this.formType = formType;
        return this;
    }

    @JsonProperty("version")
    public int getVersion() {
        return version;
    }

    @JsonProperty("version")
    public void setVersion(int version) {
        this.version = version;
    }

    public DHis2Dataset withVersion(int version) {
        this.version = version;
        return this;
    }

    @JsonProperty("displayFormName")
    public String getDisplayFormName() {
        return displayFormName;
    }

    @JsonProperty("displayFormName")
    public void setDisplayFormName(String displayFormName) {
        this.displayFormName = displayFormName;
    }

    public DHis2Dataset withDisplayFormName(String displayFormName) {
        this.displayFormName = displayFormName;
        return this;
    }

    @JsonProperty("timelyDays")
    public int getTimelyDays() {
        return timelyDays;
    }

    @JsonProperty("timelyDays")
    public void setTimelyDays(int timelyDays) {
        this.timelyDays = timelyDays;
    }

    public DHis2Dataset withTimelyDays(int timelyDays) {
        this.timelyDays = timelyDays;
        return this;
    }

    @JsonProperty("favorite")
    public boolean isFavorite() {
        return favorite;
    }

    @JsonProperty("favorite")
    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public DHis2Dataset withFavorite(boolean favorite) {
        this.favorite = favorite;
        return this;
    }

    @JsonProperty("dimensionItemType")
    public String getDimensionItemType() {
        return dimensionItemType;
    }

    @JsonProperty("dimensionItemType")
    public void setDimensionItemType(String dimensionItemType) {
        this.dimensionItemType = dimensionItemType;
    }

    public DHis2Dataset withDimensionItemType(String dimensionItemType) {
        this.dimensionItemType = dimensionItemType;
        return this;
    }

    @JsonProperty("dataElementDecoration")
    public boolean isDataElementDecoration() {
        return dataElementDecoration;
    }

    @JsonProperty("dataElementDecoration")
    public void setDataElementDecoration(boolean dataElementDecoration) {
        this.dataElementDecoration = dataElementDecoration;
    }

    public DHis2Dataset withDataElementDecoration(boolean dataElementDecoration) {
        this.dataElementDecoration = dataElementDecoration;
        return this;
    }

    @JsonProperty("notifyCompletingUser")
    public boolean isNotifyCompletingUser() {
        return notifyCompletingUser;
    }

    @JsonProperty("notifyCompletingUser")
    public void setNotifyCompletingUser(boolean notifyCompletingUser) {
        this.notifyCompletingUser = notifyCompletingUser;
    }

    public DHis2Dataset withNotifyCompletingUser(boolean notifyCompletingUser) {
        this.notifyCompletingUser = notifyCompletingUser;
        return this;
    }

    @JsonProperty("displayName")
    public String getDisplayName() {
        return displayName;
    }

    @JsonProperty("displayName")
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public DHis2Dataset withDisplayName(String displayName) {
        this.displayName = displayName;
        return this;
    }

    @JsonProperty("noValueRequiresComment")
    public boolean isNoValueRequiresComment() {
        return noValueRequiresComment;
    }

    @JsonProperty("noValueRequiresComment")
    public void setNoValueRequiresComment(boolean noValueRequiresComment) {
        this.noValueRequiresComment = noValueRequiresComment;
    }

    public DHis2Dataset withNoValueRequiresComment(boolean noValueRequiresComment) {
        this.noValueRequiresComment = noValueRequiresComment;
        return this;
    }

    @JsonProperty("displayShortName")
    public String getDisplayShortName() {
        return displayShortName;
    }

    @JsonProperty("displayShortName")
    public void setDisplayShortName(String displayShortName) {
        this.displayShortName = displayShortName;
    }

    public DHis2Dataset withDisplayShortName(String displayShortName) {
        this.displayShortName = displayShortName;
        return this;
    }

    @JsonProperty("externalAccess")
    public boolean isExternalAccess() {
        return externalAccess;
    }

    @JsonProperty("externalAccess")
    public void setExternalAccess(boolean externalAccess) {
        this.externalAccess = externalAccess;
    }

    public DHis2Dataset withExternalAccess(boolean externalAccess) {
        this.externalAccess = externalAccess;
        return this;
    }

    @JsonProperty("fieldCombinationRequired")
    public boolean isFieldCombinationRequired() {
        return fieldCombinationRequired;
    }

    @JsonProperty("fieldCombinationRequired")
    public void setFieldCombinationRequired(boolean fieldCombinationRequired) {
        this.fieldCombinationRequired = fieldCombinationRequired;
    }

    public DHis2Dataset withFieldCombinationRequired(boolean fieldCombinationRequired) {
        this.fieldCombinationRequired = fieldCombinationRequired;
        return this;
    }

    @JsonProperty("renderHorizontally")
    public boolean isRenderHorizontally() {
        return renderHorizontally;
    }

    @JsonProperty("renderHorizontally")
    public void setRenderHorizontally(boolean renderHorizontally) {
        this.renderHorizontally = renderHorizontally;
    }

    public DHis2Dataset withRenderHorizontally(boolean renderHorizontally) {
        this.renderHorizontally = renderHorizontally;
        return this;
    }

    @JsonProperty("renderAsTabs")
    public boolean isRenderAsTabs() {
        return renderAsTabs;
    }

    @JsonProperty("renderAsTabs")
    public void setRenderAsTabs(boolean renderAsTabs) {
        this.renderAsTabs = renderAsTabs;
    }

    public DHis2Dataset withRenderAsTabs(boolean renderAsTabs) {
        this.renderAsTabs = renderAsTabs;
        return this;
    }

    @JsonProperty("mobile")
    public boolean isMobile() {
        return mobile;
    }

    @JsonProperty("mobile")
    public void setMobile(boolean mobile) {
        this.mobile = mobile;
    }

    public DHis2Dataset withMobile(boolean mobile) {
        this.mobile = mobile;
        return this;
    }

    @JsonProperty("openPeriodsAfterCoEndDate")
    public int getOpenPeriodsAfterCoEndDate() {
        return openPeriodsAfterCoEndDate;
    }

    @JsonProperty("openPeriodsAfterCoEndDate")
    public void setOpenPeriodsAfterCoEndDate(int openPeriodsAfterCoEndDate) {
        this.openPeriodsAfterCoEndDate = openPeriodsAfterCoEndDate;
    }

    public DHis2Dataset withOpenPeriodsAfterCoEndDate(int openPeriodsAfterCoEndDate) {
        this.openPeriodsAfterCoEndDate = openPeriodsAfterCoEndDate;
        return this;
    }

    @JsonProperty("periodType")
    public String getPeriodType() {
        return periodType;
    }

    @JsonProperty("periodType")
    public void setPeriodType(String periodType) {
        this.periodType = periodType;
    }

    public DHis2Dataset withPeriodType(String periodType) {
        this.periodType = periodType;
        return this;
    }

    @JsonProperty("openFuturePeriods")
    public int getOpenFuturePeriods() {
        return openFuturePeriods;
    }

    @JsonProperty("openFuturePeriods")
    public void setOpenFuturePeriods(int openFuturePeriods) {
        this.openFuturePeriods = openFuturePeriods;
    }

    public DHis2Dataset withOpenFuturePeriods(int openFuturePeriods) {
        this.openFuturePeriods = openFuturePeriods;
        return this;
    }

    @JsonProperty("expiryDays")
    public int getExpiryDays() {
        return expiryDays;
    }

    @JsonProperty("expiryDays")
    public void setExpiryDays(int expiryDays) {
        this.expiryDays = expiryDays;
    }

    public DHis2Dataset withExpiryDays(int expiryDays) {
        this.expiryDays = expiryDays;
        return this;
    }

    @JsonProperty("categoryCombo")
    public CategoryCombo getCategoryCombo() {
        return categoryCombo;
    }

    @JsonProperty("categoryCombo")
    public void setCategoryCombo(CategoryCombo categoryCombo) {
        this.categoryCombo = categoryCombo;
    }

    public DHis2Dataset withCategoryCombo(CategoryCombo categoryCombo) {
        this.categoryCombo = categoryCombo;
        return this;
    }

    @JsonProperty("legendSet")
    public LegendSet getLegendSet() {
        return legendSet;
    }

    @JsonProperty("legendSet")
    public void setLegendSet(LegendSet legendSet) {
        this.legendSet = legendSet;
    }

    public DHis2Dataset withLegendSet(LegendSet legendSet) {
        this.legendSet = legendSet;
        return this;
    }

    @JsonProperty("user")
    public User getUser() {
        return user;
    }

    @JsonProperty("user")
    public void setUser(User user) {
        this.user = user;
    }

    public DHis2Dataset withUser(User user) {
        this.user = user;
        return this;
    }

    @JsonProperty("dataSetElements")
    public List<DataSetElement> getDataSetElements() {
        return dataSetElements;
    }

    @JsonProperty("dataSetElements")
    public void setDataSetElements(List<DataSetElement> dataSetElements) {
        this.dataSetElements = dataSetElements;
    }

    public DHis2Dataset withDataSetElements(List<DataSetElement> dataSetElements) {
        this.dataSetElements = dataSetElements;
        return this;
    }

    @JsonProperty("dataInputPeriods")
    public List<Object> getDataInputPeriods() {
        return dataInputPeriods;
    }

    @JsonProperty("dataInputPeriods")
    public void setDataInputPeriods(List<Object> dataInputPeriods) {
        this.dataInputPeriods = dataInputPeriods;
    }

    public DHis2Dataset withDataInputPeriods(List<Object> dataInputPeriods) {
        this.dataInputPeriods = dataInputPeriods;
        return this;
    }

    @JsonProperty("translations")
    public List<Object> getTranslations() {
        return translations;
    }

    @JsonProperty("translations")
    public void setTranslations(List<Object> translations) {
        this.translations = translations;
    }

    public DHis2Dataset withTranslations(List<Object> translations) {
        this.translations = translations;
        return this;
    }

    @JsonProperty("interpretations")
    public List<Object> getInterpretations() {
        return interpretations;
    }

    @JsonProperty("interpretations")
    public void setInterpretations(List<Object> interpretations) {
        this.interpretations = interpretations;
    }

    public DHis2Dataset withInterpretations(List<Object> interpretations) {
        this.interpretations = interpretations;
        return this;
    }

    @JsonProperty("userGroupAccesses")
    public List<Object> getUserGroupAccesses() {
        return userGroupAccesses;
    }

    @JsonProperty("userGroupAccesses")
    public void setUserGroupAccesses(List<Object> userGroupAccesses) {
        this.userGroupAccesses = userGroupAccesses;
    }

    public DHis2Dataset withUserGroupAccesses(List<Object> userGroupAccesses) {
        this.userGroupAccesses = userGroupAccesses;
        return this;
    }

    @JsonProperty("attributeValues")
    public List<Object> getAttributeValues() {
        return attributeValues;
    }

    @JsonProperty("attributeValues")
    public void setAttributeValues(List<Object> attributeValues) {
        this.attributeValues = attributeValues;
    }

    public DHis2Dataset withAttributeValues(List<Object> attributeValues) {
        this.attributeValues = attributeValues;
        return this;
    }

    @JsonProperty("indicators")
    public List<Indicator> getIndicators() {
        return indicators;
    }

    @JsonProperty("indicators")
    public void setIndicators(List<Indicator> indicators) {
        this.indicators = indicators;
    }

    public DHis2Dataset withIndicators(List<Indicator> indicators) {
        this.indicators = indicators;
        return this;
    }

    @JsonProperty("sections")
    public List<Object> getSections() {
        return sections;
    }

    @JsonProperty("sections")
    public void setSections(List<Object> sections) {
        this.sections = sections;
    }

    public DHis2Dataset withSections(List<Object> sections) {
        this.sections = sections;
        return this;
    }

    @JsonProperty("userAccesses")
    public List<Object> getUserAccesses() {
        return userAccesses;
    }

    @JsonProperty("userAccesses")
    public void setUserAccesses(List<Object> userAccesses) {
        this.userAccesses = userAccesses;
    }

    public DHis2Dataset withUserAccesses(List<Object> userAccesses) {
        this.userAccesses = userAccesses;
        return this;
    }

    @JsonProperty("legendSets")
    public List<LegendSet> getLegendSets() {
        return legendSets;
    }

    @JsonProperty("legendSets")
    public void setLegendSets(List<LegendSet> legendSets) {
        this.legendSets = legendSets;
    }

    public DHis2Dataset withLegendSets(List<LegendSet> legendSets) {
        this.legendSets = legendSets;
        return this;
    }

    @JsonProperty("favorites")
    public List<Object> getFavorites() {
        return favorites;
    }

    @JsonProperty("favorites")
    public void setFavorites(List<Object> favorites) {
        this.favorites = favorites;
    }

    public DHis2Dataset withFavorites(List<Object> favorites) {
        this.favorites = favorites;
        return this;
    }

    @JsonProperty("compulsoryDataElementOperands")
    public List<Object> getCompulsoryDataElementOperands() {
        return compulsoryDataElementOperands;
    }

    @JsonProperty("compulsoryDataElementOperands")
    public void setCompulsoryDataElementOperands(List<Object> compulsoryDataElementOperands) {
        this.compulsoryDataElementOperands = compulsoryDataElementOperands;
    }

    public DHis2Dataset withCompulsoryDataElementOperands(List<Object> compulsoryDataElementOperands) {
        this.compulsoryDataElementOperands = compulsoryDataElementOperands;
        return this;
    }

    @JsonProperty("organisationUnits")
    public List<OrganisationUnit> getOrganisationUnits() {
        return organisationUnits;
    }

    @JsonProperty("organisationUnits")
    public void setOrganisationUnits(List<OrganisationUnit> organisationUnits) {
        this.organisationUnits = organisationUnits;
    }

    public DHis2Dataset withOrganisationUnits(List<OrganisationUnit> organisationUnits) {
        this.organisationUnits = organisationUnits;
        return this;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    public DHis2Dataset withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

    public CampaginResponse getCampaginResponse(){
        CampaginResponse response = new CampaginResponse();
        response.setCampaginName(this.name);
        response.setCampaginIndicators(this.indicators);
        response.setCampaginCategoryComboId(this.categoryCombo);
        response.setCampaginLegends(this.legendSets);
        response.setCampaginPeriodType(this.periodType);
        response.setDisplayCampaginName(this.displayName);
        response.setCampaignExpiryDays(this.expiryDays);
        response.setCampaignTimelyDays(this.timelyDays);
        response.setCampaignOpenPeriodsAfterCoEndDate(this.openPeriodsAfterCoEndDate);
        response.setFormFields(this.dataSetElements);
        return response;
    }


}
