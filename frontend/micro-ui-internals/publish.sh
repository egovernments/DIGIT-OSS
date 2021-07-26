#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

# msg "Pre-building all packages"
# yarn build
# sleep 5

msg "Building and publishing css"
cd "$BASEDIR/packages/css" && yarn publish --access public

msg "Building and publishing libraries"
cd "$BASEDIR/packages/libraries" && yarn publish --access public

msg "Building and publishing react-components"
cd "$BASEDIR/packages/react-components" && yarn publish --access public

# sleep 10
# msg "Updating dependencies"
# cd "$BASEDIR" && yarn upgrade -S @egovernments
# sleep 5

msg "Building and publishing PGR module"
cd "$BASEDIR/packages/modules/pgr" && yarn publish --access public

msg "Building and publishing FSM module"
cd "$BASEDIR/packages/modules/fsm" && yarn publish --access public

msg "Building and publishing PT module"
cd "$BASEDIR/packages/modules/pt" && yarn publish --access public

msg "Building and publishing DSS module"
cd "$BASEDIR/packages/modules/dss" && yarn publish --access public

msg "Building and publishing Common module"
cd "$BASEDIR/packages/modules/common" && yarn publish --access public

msg "Building and publishing Core module"
cd "$BASEDIR/packages/modules/core" && yarn publish --access public
