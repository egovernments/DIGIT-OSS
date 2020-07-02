package com.ingestpipeline.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class TopicContextConfig {

    private List<TopicContext> topicContexts = new ArrayList<>();

    @JsonProperty(value = "topicContextConfigurations")
    public List<TopicContext> getTopicContexts() {
        return topicContexts;
    }
    public void setTopicContexts(List<TopicContext> topicContexts) {
        this.topicContexts = topicContexts;
    }
}
