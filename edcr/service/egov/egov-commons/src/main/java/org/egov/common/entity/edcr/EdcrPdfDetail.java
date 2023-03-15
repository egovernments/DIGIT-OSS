/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) <2019>  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *      Further, all user interfaces, including but not limited to citizen facing interfaces,
 *         Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *         derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *      For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *      For any further queries on attribution, including queries on brand guidelines,
 *         please contact contact@egovernments.org
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.common.entity.edcr;

import java.io.File;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Transient;

import org.egov.edcr.entity.PdfPageSize;

public class EdcrPdfDetail implements Serializable {

    private static final long serialVersionUID = 63L;

    private String layer;

    @Transient
    private File convertedPdf;

    private String failureReasons;

    private String standardViolations;

    private List<String> violations;

    @Transient
    private List<String> layers;
    @Transient
    private PdfPageSize pageSize;
    @Transient
    private List<String> measurementLayers = new ArrayList<>();
    @Transient
    private List<String> dimensionLayers = new ArrayList<>();
    @Transient
    private List<String> printNameLayers = new ArrayList<>();

    @Transient
    private Map<String, Integer> colorOverrides = new HashMap<>();
    @Transient
    private Map<String, Integer> thicknessOverrides = new HashMap<>();
    
    private String downloadURL;

    public String getLayer() {
        return layer;
    }

    public void setLayer(String layer) {
        this.layer = layer;
    }

    public File getConvertedPdf() {
        return convertedPdf;
    }

    public void setConvertedPdf(File convertedPdf) {
        this.convertedPdf = convertedPdf;
    }

    public String getFailureReasons() {
        return failureReasons;
    }

    public void setFailureReasons(String failureReasons) {
        this.failureReasons = failureReasons;
    }

    public String getStandardViolations() {
        return standardViolations;
    }

    public void setStandardViolations(String standardViolations) {
        this.standardViolations = standardViolations;
    }

    public List<String> getViolations() {
        return violations;
    }

    public void setViolations(List<String> violations) {
        this.violations = violations;
    }

    public List<String> getLayers() {
        return layers;
    }

    public void setLayers(List<String> layers) {
        this.layers = layers;
    }

    public PdfPageSize getPageSize() {
        return pageSize;
    }

    public void setPageSize(PdfPageSize pageSize) {
        this.pageSize = pageSize;
    }

    public List<String> getMeasurementLayers() {
        return measurementLayers;
    }

    public void setMeasurementLayers(List<String> measurementLayers) {
        this.measurementLayers = measurementLayers;
    }

    public List<String> getDimensionLayers() {
        return dimensionLayers;
    }

    public void setDimensionLayers(List<String> dimensionLayers) {
        this.dimensionLayers = dimensionLayers;
    }

    public List<String> getPrintNameLayers() {
        return printNameLayers;
    }

    public void setPrintNameLayers(List<String> printNameLayers) {
        this.printNameLayers = printNameLayers;
    }

    public Map<String, Integer> getColorOverrides() {
        return colorOverrides;
    }

    public void setColorOverrides(Map<String, Integer> colorOverrides) {
        this.colorOverrides = colorOverrides;
    }

    public Map<String, Integer> getThicknessOverrides() {
        return thicknessOverrides;
    }

    public void setThicknessOverrides(Map<String, Integer> thicknessOverrides) {
        this.thicknessOverrides = thicknessOverrides;
    }

    public String getDownloadURL() {
        return downloadURL;
    }

    public void setDownloadURL(String downloadURL) {
        this.downloadURL = downloadURL;
    }

}
