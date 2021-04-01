package com.tarento.analytics.handler;

import com.tarento.analytics.enums.ChartType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ResponseHandlerFactory {

    @Autowired
    private MetricChartResponseHandler metricChartResponseHandler;
    @Autowired
    private LineChartResponseHandler lineChartResponseHandler;
    @Autowired
    private PieChartResponseHandler pieChartResponseHandler;
    @Autowired
    private PerformanceChartResponeHandler performingBarChartResponeHandler;
    @Autowired
    private TableChartResponseHandler tableChartResponseHandler;
    @Autowired
    private AdvanceTableChartResponseHandler advanceTableChartResponseHandler;


    public IResponseHandler getInstance(ChartType chartType) {

        if (chartType == chartType.METRIC) {
            return metricChartResponseHandler;

        } else if (chartType == chartType.LINE) {
            return lineChartResponseHandler;

        } else if (chartType == chartType.PIE) {
            return pieChartResponseHandler;

        } else if (chartType == chartType.PERFORM) {
            return performingBarChartResponeHandler;

        }  else if (chartType == chartType.TABLE) {
            return tableChartResponseHandler;

        }   else if (chartType == chartType.XTABLE) {
            return advanceTableChartResponseHandler;
        }

        return null;
    }

    @Autowired
    private TablePostResponseHandler tablePostResponseHandler;
    public IPostResponseHandler get(ChartType chartType){

        if(chartType == chartType.TABLE){
            return tablePostResponseHandler;
        }
        return null;
    }

}


