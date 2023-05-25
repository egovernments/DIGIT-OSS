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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Occupancy extends Measurement {

    private static final long serialVersionUID = 22L;

    private OccupancyType type;
    private OccupancyTypeHelper typeHelper;
    private BigDecimal deduction = BigDecimal.ZERO;
    private BigDecimal builtUpArea = BigDecimal.ZERO;
    private BigDecimal floorArea = BigDecimal.ZERO;
    private BigDecimal carpetArea = BigDecimal.ZERO;
    private BigDecimal carpetAreaDeduction = BigDecimal.ZERO;
    private BigDecimal existingBuiltUpArea = BigDecimal.ZERO;
    private BigDecimal existingFloorArea = BigDecimal.ZERO;
    private BigDecimal existingCarpetArea = BigDecimal.ZERO;
    private BigDecimal existingCarpetAreaDeduction = BigDecimal.ZERO;
    private BigDecimal existingDeduction = BigDecimal.ZERO;
    private Boolean withAttachedBath = false;
    private Boolean withOutAttachedBath = false;
    private Boolean withDinningSpace = false;
    private List<Measurement> recreationalSpace = new ArrayList<>();
    private String mezzanineNumber;
    private Boolean isMezzanine = false;

    public void setExistingBuiltUpArea(BigDecimal existingBuiltUpArea) {
        this.existingBuiltUpArea = existingBuiltUpArea;
    }

    public void setExistingFloorArea(BigDecimal existingFloorArea) {
        this.existingFloorArea = existingFloorArea;
    }

    public void setExistingCarpetArea(BigDecimal existingCarpetArea) {
        this.existingCarpetArea = existingCarpetArea;
    }

    public void setExistingDeduction(BigDecimal existingDeduction) {
        this.existingDeduction = existingDeduction;
    }

    public BigDecimal getExistingBuiltUpArea() {
        return existingBuiltUpArea;
    }

    public BigDecimal getExistingFloorArea() {
        return existingFloorArea;
    }

    public BigDecimal getExistingCarpetArea() {
        return existingCarpetArea;
    }

    public BigDecimal getExistingDeduction() {
        return existingDeduction;
    }

    public void setWithAttachedBath(Boolean withAttachedBath) {
        this.withAttachedBath = withAttachedBath;
    }

    public void setWithOutAttachedBath(Boolean withOutAttachedBath) {
        this.withOutAttachedBath = withOutAttachedBath;
    }

    public void setWithDinningSpace(Boolean withDinningSpace) {
        this.withDinningSpace = withDinningSpace;
    }

    public Boolean getWithAttachedBath() {
        return withAttachedBath;
    }

    public Boolean getWithOutAttachedBath() {
        return withOutAttachedBath;
    }

    public Boolean getWithDinningSpace() {
        return withDinningSpace;
    }

    public OccupancyType getType() {
        return type;
    }

    public void setType(OccupancyType type) {
        this.type = type;
    }

    public OccupancyTypeHelper getTypeHelper() {
        return typeHelper;
    }

    public void setTypeHelper(OccupancyTypeHelper typeHelper) {
        this.typeHelper = typeHelper;
    }

    public BigDecimal getDeduction() {

        return deduction;
    }

    public void setDeduction(BigDecimal deduction) {
        this.deduction = deduction;
    }

    public void setBuiltUpArea(BigDecimal builtUpArea) {
        this.builtUpArea = builtUpArea;
    }

    public void setFloorArea(BigDecimal floorArea) {
        this.floorArea = floorArea;
    }

    public void setCarpetArea(BigDecimal carpetArea) {
        this.carpetArea = carpetArea;
    }

    public BigDecimal getBuiltUpArea() {
        return builtUpArea;
    }

    public BigDecimal getFloorArea() {
        return floorArea;
    }

    public BigDecimal getCarpetArea() {
        return carpetArea;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((typeHelper == null) ? 0 : typeHelper.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Occupancy other = (Occupancy) obj;
        return !typeHelper.equals(other.typeHelper);
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public List<Measurement> getRecreationalSpace() {
        return recreationalSpace;
    }

    public void setRecreationalSpace(List<Measurement> recreationalSpace) {
        this.recreationalSpace = recreationalSpace;
    }

    public String getMezzanineNumber() {
        return mezzanineNumber;
    }

    public void setMezzanineNumber(String mezzanineNumber) {
        this.mezzanineNumber = mezzanineNumber;
    }

    public Boolean getIsMezzanine() {
        return isMezzanine;
    }

    public void setIsMezzanine(Boolean isMezzanine) {
        this.isMezzanine = isMezzanine;
    }

    public BigDecimal getCarpetAreaDeduction() {
        return carpetAreaDeduction;
    }

    public void setCarpetAreaDeduction(BigDecimal carpetAreaDeduction) {
        this.carpetAreaDeduction = carpetAreaDeduction;
    }

    public BigDecimal getExistingCarpetAreaDeduction() {
        return existingCarpetAreaDeduction;
    }

    public void setExistingCarpetAreaDeduction(BigDecimal existingCarpetAreaDeduction) {
        this.existingCarpetAreaDeduction = existingCarpetAreaDeduction;
    }
    
}
