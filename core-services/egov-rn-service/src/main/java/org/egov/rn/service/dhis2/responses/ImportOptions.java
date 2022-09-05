
package org.egov.rn.service.dhis2.responses;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "idSchemes",
    "dryRun",
    "async",
    "importStrategy",
    "mergeMode",
    "reportMode",
    "skipExistingCheck",
    "sharing",
    "skipNotifications",
    "skipAudit",
    "datasetAllowsPeriods",
    "strictPeriods",
    "strictDataElements",
    "strictCategoryOptionCombos",
    "strictAttributeOptionCombos",
    "strictOrganisationUnits",
    "requireCategoryOptionCombo",
    "requireAttributeOptionCombo",
    "skipPatternValidation",
    "ignoreEmptyCollection",
    "force",
    "firstRowIsHeader",
    "skipLastUpdated",
    "mergeDataValues",
    "skipCache"
})
@Generated("jsonschema2pojo")
public class ImportOptions {

    @JsonProperty("idSchemes")
    private IdSchemes idSchemes;
    @JsonProperty("dryRun")
    private boolean dryRun;
    @JsonProperty("async")
    private boolean async;
    @JsonProperty("importStrategy")
    private String importStrategy;
    @JsonProperty("mergeMode")
    private String mergeMode;
    @JsonProperty("reportMode")
    private String reportMode;
    @JsonProperty("skipExistingCheck")
    private boolean skipExistingCheck;
    @JsonProperty("sharing")
    private boolean sharing;
    @JsonProperty("skipNotifications")
    private boolean skipNotifications;
    @JsonProperty("skipAudit")
    private boolean skipAudit;
    @JsonProperty("datasetAllowsPeriods")
    private boolean datasetAllowsPeriods;
    @JsonProperty("strictPeriods")
    private boolean strictPeriods;
    @JsonProperty("strictDataElements")
    private boolean strictDataElements;
    @JsonProperty("strictCategoryOptionCombos")
    private boolean strictCategoryOptionCombos;
    @JsonProperty("strictAttributeOptionCombos")
    private boolean strictAttributeOptionCombos;
    @JsonProperty("strictOrganisationUnits")
    private boolean strictOrganisationUnits;
    @JsonProperty("requireCategoryOptionCombo")
    private boolean requireCategoryOptionCombo;
    @JsonProperty("requireAttributeOptionCombo")
    private boolean requireAttributeOptionCombo;
    @JsonProperty("skipPatternValidation")
    private boolean skipPatternValidation;
    @JsonProperty("ignoreEmptyCollection")
    private boolean ignoreEmptyCollection;
    @JsonProperty("force")
    private boolean force;
    @JsonProperty("firstRowIsHeader")
    private boolean firstRowIsHeader;
    @JsonProperty("skipLastUpdated")
    private boolean skipLastUpdated;
    @JsonProperty("mergeDataValues")
    private boolean mergeDataValues;
    @JsonProperty("skipCache")
    private boolean skipCache;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public ImportOptions() {
    }

    /**
     * 
     * @param dryRun
     * @param skipCache
     * @param datasetAllowsPeriods
     * @param skipPatternValidation
     * @param mergeMode
     * @param strictCategoryOptionCombos
     * @param idSchemes
     * @param strictPeriods
     * @param ignoreEmptyCollection
     * @param firstRowIsHeader
     * @param strictAttributeOptionCombos
     * @param skipExistingCheck
     * @param skipNotifications
     * @param strictDataElements
     * @param reportMode
     * @param sharing
     * @param requireAttributeOptionCombo
     * @param skipAudit
     * @param async
     * @param requireCategoryOptionCombo
     * @param force
     * @param importStrategy
     * @param strictOrganisationUnits
     * @param mergeDataValues
     * @param skipLastUpdated
     */
    public ImportOptions(IdSchemes idSchemes, boolean dryRun, boolean async, String importStrategy, String mergeMode, String reportMode, boolean skipExistingCheck, boolean sharing, boolean skipNotifications, boolean skipAudit, boolean datasetAllowsPeriods, boolean strictPeriods, boolean strictDataElements, boolean strictCategoryOptionCombos, boolean strictAttributeOptionCombos, boolean strictOrganisationUnits, boolean requireCategoryOptionCombo, boolean requireAttributeOptionCombo, boolean skipPatternValidation, boolean ignoreEmptyCollection, boolean force, boolean firstRowIsHeader, boolean skipLastUpdated, boolean mergeDataValues, boolean skipCache) {
        super();
        this.idSchemes = idSchemes;
        this.dryRun = dryRun;
        this.async = async;
        this.importStrategy = importStrategy;
        this.mergeMode = mergeMode;
        this.reportMode = reportMode;
        this.skipExistingCheck = skipExistingCheck;
        this.sharing = sharing;
        this.skipNotifications = skipNotifications;
        this.skipAudit = skipAudit;
        this.datasetAllowsPeriods = datasetAllowsPeriods;
        this.strictPeriods = strictPeriods;
        this.strictDataElements = strictDataElements;
        this.strictCategoryOptionCombos = strictCategoryOptionCombos;
        this.strictAttributeOptionCombos = strictAttributeOptionCombos;
        this.strictOrganisationUnits = strictOrganisationUnits;
        this.requireCategoryOptionCombo = requireCategoryOptionCombo;
        this.requireAttributeOptionCombo = requireAttributeOptionCombo;
        this.skipPatternValidation = skipPatternValidation;
        this.ignoreEmptyCollection = ignoreEmptyCollection;
        this.force = force;
        this.firstRowIsHeader = firstRowIsHeader;
        this.skipLastUpdated = skipLastUpdated;
        this.mergeDataValues = mergeDataValues;
        this.skipCache = skipCache;
    }

    @JsonProperty("idSchemes")
    public IdSchemes getIdSchemes() {
        return idSchemes;
    }

    @JsonProperty("idSchemes")
    public void setIdSchemes(IdSchemes idSchemes) {
        this.idSchemes = idSchemes;
    }

    public ImportOptions withIdSchemes(IdSchemes idSchemes) {
        this.idSchemes = idSchemes;
        return this;
    }

    @JsonProperty("dryRun")
    public boolean isDryRun() {
        return dryRun;
    }

    @JsonProperty("dryRun")
    public void setDryRun(boolean dryRun) {
        this.dryRun = dryRun;
    }

    public ImportOptions withDryRun(boolean dryRun) {
        this.dryRun = dryRun;
        return this;
    }

    @JsonProperty("async")
    public boolean isAsync() {
        return async;
    }

    @JsonProperty("async")
    public void setAsync(boolean async) {
        this.async = async;
    }

    public ImportOptions withAsync(boolean async) {
        this.async = async;
        return this;
    }

    @JsonProperty("importStrategy")
    public String getImportStrategy() {
        return importStrategy;
    }

    @JsonProperty("importStrategy")
    public void setImportStrategy(String importStrategy) {
        this.importStrategy = importStrategy;
    }

    public ImportOptions withImportStrategy(String importStrategy) {
        this.importStrategy = importStrategy;
        return this;
    }

    @JsonProperty("mergeMode")
    public String getMergeMode() {
        return mergeMode;
    }

    @JsonProperty("mergeMode")
    public void setMergeMode(String mergeMode) {
        this.mergeMode = mergeMode;
    }

    public ImportOptions withMergeMode(String mergeMode) {
        this.mergeMode = mergeMode;
        return this;
    }

    @JsonProperty("reportMode")
    public String getReportMode() {
        return reportMode;
    }

    @JsonProperty("reportMode")
    public void setReportMode(String reportMode) {
        this.reportMode = reportMode;
    }

    public ImportOptions withReportMode(String reportMode) {
        this.reportMode = reportMode;
        return this;
    }

    @JsonProperty("skipExistingCheck")
    public boolean isSkipExistingCheck() {
        return skipExistingCheck;
    }

    @JsonProperty("skipExistingCheck")
    public void setSkipExistingCheck(boolean skipExistingCheck) {
        this.skipExistingCheck = skipExistingCheck;
    }

    public ImportOptions withSkipExistingCheck(boolean skipExistingCheck) {
        this.skipExistingCheck = skipExistingCheck;
        return this;
    }

    @JsonProperty("sharing")
    public boolean isSharing() {
        return sharing;
    }

    @JsonProperty("sharing")
    public void setSharing(boolean sharing) {
        this.sharing = sharing;
    }

    public ImportOptions withSharing(boolean sharing) {
        this.sharing = sharing;
        return this;
    }

    @JsonProperty("skipNotifications")
    public boolean isSkipNotifications() {
        return skipNotifications;
    }

    @JsonProperty("skipNotifications")
    public void setSkipNotifications(boolean skipNotifications) {
        this.skipNotifications = skipNotifications;
    }

    public ImportOptions withSkipNotifications(boolean skipNotifications) {
        this.skipNotifications = skipNotifications;
        return this;
    }

    @JsonProperty("skipAudit")
    public boolean isSkipAudit() {
        return skipAudit;
    }

    @JsonProperty("skipAudit")
    public void setSkipAudit(boolean skipAudit) {
        this.skipAudit = skipAudit;
    }

    public ImportOptions withSkipAudit(boolean skipAudit) {
        this.skipAudit = skipAudit;
        return this;
    }

    @JsonProperty("datasetAllowsPeriods")
    public boolean isDatasetAllowsPeriods() {
        return datasetAllowsPeriods;
    }

    @JsonProperty("datasetAllowsPeriods")
    public void setDatasetAllowsPeriods(boolean datasetAllowsPeriods) {
        this.datasetAllowsPeriods = datasetAllowsPeriods;
    }

    public ImportOptions withDatasetAllowsPeriods(boolean datasetAllowsPeriods) {
        this.datasetAllowsPeriods = datasetAllowsPeriods;
        return this;
    }

    @JsonProperty("strictPeriods")
    public boolean isStrictPeriods() {
        return strictPeriods;
    }

    @JsonProperty("strictPeriods")
    public void setStrictPeriods(boolean strictPeriods) {
        this.strictPeriods = strictPeriods;
    }

    public ImportOptions withStrictPeriods(boolean strictPeriods) {
        this.strictPeriods = strictPeriods;
        return this;
    }

    @JsonProperty("strictDataElements")
    public boolean isStrictDataElements() {
        return strictDataElements;
    }

    @JsonProperty("strictDataElements")
    public void setStrictDataElements(boolean strictDataElements) {
        this.strictDataElements = strictDataElements;
    }

    public ImportOptions withStrictDataElements(boolean strictDataElements) {
        this.strictDataElements = strictDataElements;
        return this;
    }

    @JsonProperty("strictCategoryOptionCombos")
    public boolean isStrictCategoryOptionCombos() {
        return strictCategoryOptionCombos;
    }

    @JsonProperty("strictCategoryOptionCombos")
    public void setStrictCategoryOptionCombos(boolean strictCategoryOptionCombos) {
        this.strictCategoryOptionCombos = strictCategoryOptionCombos;
    }

    public ImportOptions withStrictCategoryOptionCombos(boolean strictCategoryOptionCombos) {
        this.strictCategoryOptionCombos = strictCategoryOptionCombos;
        return this;
    }

    @JsonProperty("strictAttributeOptionCombos")
    public boolean isStrictAttributeOptionCombos() {
        return strictAttributeOptionCombos;
    }

    @JsonProperty("strictAttributeOptionCombos")
    public void setStrictAttributeOptionCombos(boolean strictAttributeOptionCombos) {
        this.strictAttributeOptionCombos = strictAttributeOptionCombos;
    }

    public ImportOptions withStrictAttributeOptionCombos(boolean strictAttributeOptionCombos) {
        this.strictAttributeOptionCombos = strictAttributeOptionCombos;
        return this;
    }

    @JsonProperty("strictOrganisationUnits")
    public boolean isStrictOrganisationUnits() {
        return strictOrganisationUnits;
    }

    @JsonProperty("strictOrganisationUnits")
    public void setStrictOrganisationUnits(boolean strictOrganisationUnits) {
        this.strictOrganisationUnits = strictOrganisationUnits;
    }

    public ImportOptions withStrictOrganisationUnits(boolean strictOrganisationUnits) {
        this.strictOrganisationUnits = strictOrganisationUnits;
        return this;
    }

    @JsonProperty("requireCategoryOptionCombo")
    public boolean isRequireCategoryOptionCombo() {
        return requireCategoryOptionCombo;
    }

    @JsonProperty("requireCategoryOptionCombo")
    public void setRequireCategoryOptionCombo(boolean requireCategoryOptionCombo) {
        this.requireCategoryOptionCombo = requireCategoryOptionCombo;
    }

    public ImportOptions withRequireCategoryOptionCombo(boolean requireCategoryOptionCombo) {
        this.requireCategoryOptionCombo = requireCategoryOptionCombo;
        return this;
    }

    @JsonProperty("requireAttributeOptionCombo")
    public boolean isRequireAttributeOptionCombo() {
        return requireAttributeOptionCombo;
    }

    @JsonProperty("requireAttributeOptionCombo")
    public void setRequireAttributeOptionCombo(boolean requireAttributeOptionCombo) {
        this.requireAttributeOptionCombo = requireAttributeOptionCombo;
    }

    public ImportOptions withRequireAttributeOptionCombo(boolean requireAttributeOptionCombo) {
        this.requireAttributeOptionCombo = requireAttributeOptionCombo;
        return this;
    }

    @JsonProperty("skipPatternValidation")
    public boolean isSkipPatternValidation() {
        return skipPatternValidation;
    }

    @JsonProperty("skipPatternValidation")
    public void setSkipPatternValidation(boolean skipPatternValidation) {
        this.skipPatternValidation = skipPatternValidation;
    }

    public ImportOptions withSkipPatternValidation(boolean skipPatternValidation) {
        this.skipPatternValidation = skipPatternValidation;
        return this;
    }

    @JsonProperty("ignoreEmptyCollection")
    public boolean isIgnoreEmptyCollection() {
        return ignoreEmptyCollection;
    }

    @JsonProperty("ignoreEmptyCollection")
    public void setIgnoreEmptyCollection(boolean ignoreEmptyCollection) {
        this.ignoreEmptyCollection = ignoreEmptyCollection;
    }

    public ImportOptions withIgnoreEmptyCollection(boolean ignoreEmptyCollection) {
        this.ignoreEmptyCollection = ignoreEmptyCollection;
        return this;
    }

    @JsonProperty("force")
    public boolean isForce() {
        return force;
    }

    @JsonProperty("force")
    public void setForce(boolean force) {
        this.force = force;
    }

    public ImportOptions withForce(boolean force) {
        this.force = force;
        return this;
    }

    @JsonProperty("firstRowIsHeader")
    public boolean isFirstRowIsHeader() {
        return firstRowIsHeader;
    }

    @JsonProperty("firstRowIsHeader")
    public void setFirstRowIsHeader(boolean firstRowIsHeader) {
        this.firstRowIsHeader = firstRowIsHeader;
    }

    public ImportOptions withFirstRowIsHeader(boolean firstRowIsHeader) {
        this.firstRowIsHeader = firstRowIsHeader;
        return this;
    }

    @JsonProperty("skipLastUpdated")
    public boolean isSkipLastUpdated() {
        return skipLastUpdated;
    }

    @JsonProperty("skipLastUpdated")
    public void setSkipLastUpdated(boolean skipLastUpdated) {
        this.skipLastUpdated = skipLastUpdated;
    }

    public ImportOptions withSkipLastUpdated(boolean skipLastUpdated) {
        this.skipLastUpdated = skipLastUpdated;
        return this;
    }

    @JsonProperty("mergeDataValues")
    public boolean isMergeDataValues() {
        return mergeDataValues;
    }

    @JsonProperty("mergeDataValues")
    public void setMergeDataValues(boolean mergeDataValues) {
        this.mergeDataValues = mergeDataValues;
    }

    public ImportOptions withMergeDataValues(boolean mergeDataValues) {
        this.mergeDataValues = mergeDataValues;
        return this;
    }

    @JsonProperty("skipCache")
    public boolean isSkipCache() {
        return skipCache;
    }

    @JsonProperty("skipCache")
    public void setSkipCache(boolean skipCache) {
        this.skipCache = skipCache;
    }

    public ImportOptions withSkipCache(boolean skipCache) {
        this.skipCache = skipCache;
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

    public ImportOptions withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
