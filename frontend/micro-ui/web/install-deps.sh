#!/bin/sh

BRANCH="$(git branch --show-current)"

echo "Main Branch: $BRANCH"

INTERNALS="micro-ui-internals"

cd $INTERNALS && echo "$(git log -1 --pretty=%B)" && echo "installing packages" && yarn install && echo "starting build" && yarn build && echo "building finished"  \; 
cd ..



# yarn install
