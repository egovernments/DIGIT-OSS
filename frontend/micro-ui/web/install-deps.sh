#!/bin/sh

BRANCH="$(git branch --show-current)"

echo $BRANCH

if [ "$BRANCH" != "dev" ] || [ "$BRANCH" != "master" ]; then

  INTERNALS="digit-ui-internals"
  rm -rf $INTERNALS
  git clone -b development https://github.com/egovernments/digit-ui-internals.git $INTERNALS
  cd $INTERNALS && yarn && yarn build
  cd ..

  rm -rf node_modules yarn.lock

fi

echo $BRANCH
