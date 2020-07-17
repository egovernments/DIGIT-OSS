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
/*
 * The plot information with setback details.
 */
public class Plot extends Measurement {

    private static final long serialVersionUID = 17L;

    public static final String PLOT_BOUNDARY = "PLOT_BOUNDARY";
    private Yard frontYard;
    private Yard rearYard;
    private Yard sideYard1;
    private Yard sideYard2;

    private List<SetBack> setBacks = new ArrayList<>();

    private Measurement buildingFootPrint = new Measurement();

    private Yard bsmtFrontYard;
    private Yard bsmtRearYard;
    private Yard bsmtSideYard1;
    private Yard bsmtSideYard2;

    private Boolean smallPlot = false;

    private BigDecimal plotBndryArea;

    public SetBack getLevelZeroSetBack() {
        SetBack setBack = null;

        for (SetBack setback : getSetBacks()) {
            if (setback.getLevel() == 0)
                return setback;
        }
        return setBack;
    }

    public List<SetBack> getSetBacks() {
        return setBacks;
    }

    public void setSetBacks(List<SetBack> setBacks) {
        this.setBacks = setBacks;
    }

    public Measurement getBuildingFootPrint() {
        return buildingFootPrint;
    }

    public void setBuildingFootPrint(Measurement buildingFootPrint) {
        this.buildingFootPrint = buildingFootPrint;
    }

    public Yard getFrontYard() {
        return frontYard;
    }

    public void setFrontYard(Yard frontYard) {
        this.frontYard = frontYard;
    }

    public Yard getRearYard() {
        return rearYard;
    }

    public void setRearYard(Yard rearYard) {
        this.rearYard = rearYard;
    }

    public Yard getSideYard1() {
        return sideYard1;
    }

    public void setSideYard1(Yard sideYard1) {
        this.sideYard1 = sideYard1;
    }

    public Yard getSideYard2() {
        return sideYard2;
    }

    public void setSideYard2(Yard sideYard2) {
        this.sideYard2 = sideYard2;
    }

    public Yard getBsmtFrontYard() {
        return bsmtFrontYard;
    }

    public void setBsmtFrontYard(Yard bsmtFrontYard) {
        this.bsmtFrontYard = bsmtFrontYard;
    }

    public Yard getBsmtRearYard() {
        return bsmtRearYard;
    }

    public void setBsmtRearYard(Yard bsmtRearYard) {
        this.bsmtRearYard = bsmtRearYard;
    }

    public Yard getBsmtSideYard1() {
        return bsmtSideYard1;
    }

    public void setBsmtSideYard1(Yard bsmtSideYard1) {
        this.bsmtSideYard1 = bsmtSideYard1;
    }

    public Yard getBsmtSideYard2() {
        return bsmtSideYard2;
    }

    public void setBsmtSideYard2(Yard bsmtSideYard2) {
        this.bsmtSideYard2 = bsmtSideYard2;
    }

    public Boolean getSmallPlot() {
        return smallPlot;
    }

    public void setSmallPlot(Boolean smallPlot) {
        this.smallPlot = smallPlot;
    }

    public BigDecimal getPlotBndryArea() {
        return plotBndryArea;
    }

    public void setPlotBndryArea(BigDecimal plotBndryArea) {
        this.plotBndryArea = plotBndryArea;
    }
}
