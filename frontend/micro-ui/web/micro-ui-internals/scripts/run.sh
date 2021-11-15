#!/bin/bash

MODULES=( "components" "common" "core" "libraries" "example" )

RUNARGS=()
BUILDARGS=()

for var in "$@"
do 
    BUILDARGS=( ${BUILDARGS[@]} build:"$var" )
    RUNARGS=( ${RUNARGS[@]} dev:"$var" )
done

a=0
while [ "$a" -lt 4 ]
do 
    BUILD[$a]=build:${MODULES[$a]}
    a=` expr $a + 1 `
done

echo "BUILDING MODULES:-" ${BUILD[*]} ${BUILDARGS[*]}
yarn run-p ${BUILD[*]} ${BUILDARGS[*]}

b=0
while [ "$b" -lt 5 ]
do 
    RUN[$b]=dev:${MODULES[$b]}
    b=` expr $b + 1 `
done

echo "SERVING MODULES:-" ${RUN[*]} ${RUNARGS[*]}
yarn run-p ${RUN[*]} ${RUNARGS[*]}
