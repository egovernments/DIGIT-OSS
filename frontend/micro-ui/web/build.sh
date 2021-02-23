#!/bin/bash

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [$BRANCH == "dev"] || [$BRANCH == "master"]; then

  INTERNALS="digit-ui-internals"
  rm -rf $INTERNALS
  git clone -b development https://github.com/egovernments/digit-ui-internals.git $INTERNALS

  rm yarn.lock

fi

echo $BRANCH
