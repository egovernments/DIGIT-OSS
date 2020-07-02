package com.ingestpipeline.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class DomainIndexConfig {

    private String id;
    private String domain;
    private String indexName;
    private String documentType;
    private String query;

    private List<SourceReferences> sourceReferences = new ArrayList<>();
    private List<TargetReferences> targetReferences = new ArrayList<>();

    @JsonProperty(value="sourceReferences")
    public List<SourceReferences> getSourceReferences() {
        return sourceReferences;
    }

    public void setSourceReferences(List<SourceReferences> sourceReferences) {
        this.sourceReferences = sourceReferences;
    }
    @JsonProperty(value="targetReferences")
    public List<TargetReferences> getTargetReferences() {
        return targetReferences;
    }

    public void setTargetReferences(List<TargetReferences> targetReferences) {
        this.targetReferences = targetReferences;
    }

    @JsonProperty(value="id")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty(value="domain")
    public String getDomain() {
        return domain;
    }

    public void setDomain(String businessType) {
        this.domain = businessType;
    }

    @JsonProperty(value="indexName")
    public String getIndexName() {
        return indexName;
    }

    public void setIndexName(String indexName) {
        this.indexName = indexName;
    }

    @JsonProperty(value="documentType")
    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    @JsonProperty(value="query")
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

}
