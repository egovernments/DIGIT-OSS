#!/bin/sh

BRANCH="$(git branch --show-current)"

echo "Main Branch: $BRANCH"

INTERNALS="micro-ui-internals"

cd $INTERNALS && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && echo "installing packages" && yarn install && echo "starting build" && yarn build && echo "building finished" && find . -name "node_modules" -type d -prune -print -exec rm -rf '{}' \; 
cd ..

rm -rf node_modules
rm -f yarn.lock

# yarn install
