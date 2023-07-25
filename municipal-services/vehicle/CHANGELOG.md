
# Changelog
All notable changes to this module will be documented in this file.

## 1.2.0 - 2022-08-04

 - Vehicle logging at FSTP decoupled from FSM module 

## 1.1.0 - 2022-03-29
- Multi-trip request per application at DSO and ULB application in post pay
- Vehicle type has been replaced with Vehicle Capacity in FSM application 
- Added new step in FSM_VEHICLE_TRIP business service for FSTPO to decline vehicle trip 
- Added owner attribute for the vehicle
- Added condition to skip workflow update for Post pay complete request action and only update volume collected details in vehicle trip

## 1.0.3 - 2022-01-13

- Updated to log4j2 version 2.17.1

## 1.0.1

- Code changes related to plant mapping.
- Simple change in vehicle tank capacity.
- Added plain search service.

## 1.0.1

- Fixed security issue of untrusted data pass as user input.


## 1.0.0

- base version