package org.egov.common.entity.edcr;

import java.math.BigDecimal;

public class RoomHeight {

    private static final long serialVersionUID = 54L;
    
    private BigDecimal height;

    private int colorCode;

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public int getColorCode() {
        return colorCode;
    }

    public void setColorCode(int colorCode) {
        this.colorCode = colorCode;
    }

}
