#Changelog

All notable changes to this module will be documented in this file.

## 1.1.8-beta - 2022-11-04

- caching added to search API for performance improvement

## 1.1.7 - 2022-03-02
- LineChart ResponseHandler modified to consider the empty value for particular interval 
- TodaysCollection property added to the Metric chart, when this property is true query response is expected to have todaysDate and lastUdatedTime aggreagations which would be returned as the plots
- Performance Chart response handler changes to consider only the value of the aggregations which does not have buckets
- AdvanceTable Response handler changes to consider valueType of the chart when pathTypeDataMapping is not configured
- preActionTheory property added to metric chart type, which help to run the computeHelper on the aggregation path before applying action of the chart
	Ex: preActionTheory:{"ActualCollection":"repsonseToDifferenceOfDates"}




## 1.1.6 - 2022-01-13
- Updated to log4j2 version 2.17.1


## 1.1.5 - 2021-07-23
- Code changes related to new properties.
- Here are the properties which are added 
  - isRoundOff from configuration will round off the specific number value.
  - chartSpecificProperty, XtableColumnOrder to give the xtable column order as we mention in this configuration

## 1.1.4 - 2021-05-11
- security fixes

## 1.1.3 - 2021-02-26
- Updated egov mdms host name in application.properties

## 1.1.2 - 2020-11-18
- Removed default DDR hard coding 


## 1.1.1 - 2020-09-01

- Added LOCALSETUP.md and README.md
- updated Plot object to support String dataType

## 1.1.0 - 2020-06-24

- Added typescript definition generation plugin
- Upgraded to `tracer:2.0.0-SNAPSHOT`
- Upgraded to spring boot `2.2.6-RELEASE`

## 1.0.0

- Base version
