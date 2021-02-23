#!/bin/sh

BRANCH=${scmVars.BRANCH}

echo ${BRANCH}

# if [$BRANCH != "dev"]; then

#   INTERNALS="digit-ui-internals"
#   rm -rf $INTERNALS
#   git clone -b development https://github.com/egovernments/digit-ui-internals.git $INTERNALS

#   rm yarn.lock

# fi

