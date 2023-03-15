package com.tarento.analytics.dto;


public class Plot {

    private String label;
    private String name;
    private Double value;
    private String strValue;
    private String symbol;

    public Plot(String name, Double value, String symbol) {
        this.name = name;
        this.value = value;
        this.symbol = symbol;
    }

    public Plot(String name, String strValue, String symbol) {
        this.name = name;
        this.strValue = strValue;
        this.symbol = symbol;
        this.value = 0d;
    }

    public Plot(String name, String symbol) {
        this.name = name;
        this.symbol = symbol;
        this.value = null;
    }

    public String getName() {
        return name;
    }

    public Double getValue() {
        return value;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getLabel() {
        return label;
    }

    public String getStrValue() {
        return strValue;
    }

    public void setLabel(String label) {
        this.label = label;
    }
    public void setValue(Double value) {
        this.value = value;
    }
}
