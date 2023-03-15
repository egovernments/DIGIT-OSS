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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ar.com.fdvs.dj.domain.constants.HorizontalAlign;

public class ScrutinyDetail implements Serializable {
    private static final long serialVersionUID = -788830650510383907L;
    private String key;
    private String heading;
    private String remarks;
    private String subHeading;
    /**
     * Do not add heading dynamically. It should be a static text in your process API.
     */
    private Map<Integer, ColumnHeadingDetail> columnHeading = new TreeMap<>();
    private List<Map<String, String>> detail = new ArrayList<>();

    public static class ColumnHeadingDetail implements Serializable {
        private static final long serialVersionUID = 2446433602892212662L;
        public String name;
        @JsonIgnore
        public HorizontalAlign align;

    }

    public String getKey() {
        return key;
    }

    public List<Map<String, String>> getDetail() {
        return detail;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void setDetail(List<Map<String, String>> detail) {
        this.detail = detail;
    }

    public void addDetail(Map<String, String> det) {
        this.detail.add(det);
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getSubHeading() {
        return subHeading;
    }

    public void setSubHeading(String subHeading) {
        this.subHeading = subHeading;
    }

    public Map<Integer, ColumnHeadingDetail> getColumnHeading() {
        return columnHeading;
    }

    public void setColumnHeading(Map<Integer, ColumnHeadingDetail> columnHeading) {
        this.columnHeading = columnHeading;
    }

    public void addColumnHeading(Integer orderNo, String heading, HorizontalAlign align) {
        ColumnHeadingDetail colHeadingDtl = new ColumnHeadingDetail();
        if (align != null)
            colHeadingDtl.align = align;
        colHeadingDtl.name = heading;
        this.columnHeading.put(orderNo, colHeadingDtl);
    }

    public void addColumnHeading(Integer orderNo, String heading) {
        ColumnHeadingDetail colHeadingDtl = new ColumnHeadingDetail();
        colHeadingDtl.align = HorizontalAlign.LEFT;
        colHeadingDtl.name = heading;
        this.columnHeading.put(orderNo, colHeadingDtl);
    }

}