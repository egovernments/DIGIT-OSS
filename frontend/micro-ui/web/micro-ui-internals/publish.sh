#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

# msg "Pre-building all packages"
# yarn build
# sleep 5

msg "Building and publishing css"
cd "$BASEDIR/packages/css" && npm publish --access public

msg "Building and publishing libraries"
# cd "$BASEDIR/packages/libraries" && yarn publish --access public

msg "Building and publishing react-components"
# cd "$BASEDIR/packages/react-components" && yarn publish --access public

# sleep 10
# msg "Updating dependencies"
# cd "$BASEDIR" && yarn upgrade -S @egovernments
# sleep 5

msg "Building and publishing Engagement module"
cd "$BASEDIR/packages/modules/engagement" &&  rm -rf node_modules &&  rm -rf dist && yarn&& npm publish --tag core-1.0

msg "Building and publishing hrms module"
cd "$BASEDIR/packages/modules/hrms" &&  rm -rf node_modules &&  rm -rf dist && yarn&& npm publish --tag core-1.0
msg "Building and publishing DSS module"
cd "$BASEDIR/packages/modules/dss" &&  rm -rf node_modules &&  rm -rf dist && yarn&& npm publish --tag core-1.0

msg "Building and publishing Common module"
cd "$BASEDIR/packages/modules/common" &&  rm -rf node_modules &&  rm -rf dist && yarn&& npm publish --tag core-1.0

msg "Building and publishing Core module"
cd "$BASEDIR/packages/modules/core" && rm -rf node_modules &&  rm -rf dist && yarn&& npm publish --tag core-1.0
