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
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Measurement implements Cloneable, Serializable {
    private static final long serialVersionUID = 3L;

    protected String name;
    
    protected Boolean presentInDxf = false;

    protected BigDecimal minimumDistance = BigDecimal.ZERO;

    protected BigDecimal minimumSide = BigDecimal.ZERO;

    protected BigDecimal length = BigDecimal.ZERO;

    protected BigDecimal width = BigDecimal.ZERO;

    protected BigDecimal height = BigDecimal.ZERO;

    protected BigDecimal mean = BigDecimal.ZERO;

    protected BigDecimal area = BigDecimal.ZERO;

    protected Boolean isValid;

    @JsonIgnore
    protected StringBuffer invalidReason;

    protected int colorCode;

    public void setName(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public void setMinimumDistance(BigDecimal minimumDistance) {
        this.minimumDistance = minimumDistance;
    }

    public Boolean getPresentInDxf() {
        return presentInDxf;
    }

    public void setPresentInDxf(Boolean present) {
        presentInDxf = present;
    }

    public BigDecimal getLength() {
        return length;
    }

    public void setLength(BigDecimal length) {
        this.length = length;
    }

    public BigDecimal getMean() {
        return mean;
    }

    public void setMean(BigDecimal mean) {
        this.mean = mean;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public BigDecimal getWidth() {
        return width;
    }

    public void setWidth(BigDecimal width) {
        this.width = width;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public BigDecimal getMinimumDistance() {
        return minimumDistance;
    }

    @Override
    public String toString() {
        return "Measurement : presentInDxf=" + presentInDxf + "]";
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public Measurement() {
        // invariant
    }

    public BigDecimal getMinimumSide() {
        return minimumSide;
    }

    public void setMinimumSide(BigDecimal minimumSide) {
        this.minimumSide = minimumSide;
    }

    public Boolean getIsValid() {
        return isValid;
    }

    public int getColorCode() {
        return colorCode;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
    }

    public void setColorCode(int colorCode) {
        this.colorCode = colorCode;
    }

    public StringBuffer getInvalidReason() {
        return invalidReason;
    }

    public void setInvalidReason(StringBuffer invalidReason) {
        this.invalidReason = invalidReason;
    }

    public void setInvalidReason(String invalidReason) {
        this.invalidReason = new StringBuffer(invalidReason);
    }

    public void appendInvalidReason(String reason) {
        if (this.invalidReason == null)
            invalidReason = new StringBuffer();

        if (this.invalidReason.length() != 0) {
            this.invalidReason.append(", ");
        }
        this.invalidReason.append(reason);
    }

}
