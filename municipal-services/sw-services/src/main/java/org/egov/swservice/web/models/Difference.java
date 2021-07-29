package org.egov.swservice.web.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Difference {

    String id;

    List<String> fieldsChanged;

    List<String> classesAdded;

    List<String> classesRemoved;

}
