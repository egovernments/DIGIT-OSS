package org.egov.access.domain.model;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class ActionContainer {

    private Set<String> uris;
    private Set<String> regexUris;

    public ActionContainer() {
        this.uris = new HashSet<>();
        this.regexUris = new HashSet<>();
    }
}
