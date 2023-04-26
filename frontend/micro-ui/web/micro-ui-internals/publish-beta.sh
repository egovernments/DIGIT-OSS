#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

# msg "Pre-building all packages"
# yarn build
# sleep 5

msg "Building and publishing css"
cd "$BASEDIR/packages/css" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --access public

msg "Building and publishing libraries"
cd "$BASEDIR/packages/libraries" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing react-components"
cd "$BASEDIR/packages/react-components" &&  rm -rf node_modules &&  rm -rf dist&& yarn build &&  npm publish --tag urban-2.9-beta

# sleep 10
# msg "Updating dependencies"
# cd "$BASEDIR" && yarn upgrade -S @egovernments
# sleep 5

msg "Building and publishing PGR module"
cd "$BASEDIR/packages/modules/pgr" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing FSM module"
cd "$BASEDIR/packages/modules/fsm" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing PT module"
cd "$BASEDIR/packages/modules/pt" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing DSS module"
cd "$BASEDIR/packages/modules/dss" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing Common module"
cd "$BASEDIR/packages/modules/common" &&  rm -rf node_modules &&  rm -rf dist && yarn build  &&  npm publish --tag urban-2.9-beta

msg "Building and publishing Core module"
cd "$BASEDIR/packages/modules/core" &&  rm -rf node_modules &&  rm -rf dist  && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing OBPS module"
cd "$BASEDIR/packages/modules/obps" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing tl module"
cd "$BASEDIR/packages/modules/tl" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing bills module"
cd "$BASEDIR/packages/modules/bills" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing noc module"
cd "$BASEDIR/packages/modules/noc" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing commonPt module"
cd "$BASEDIR/packages/modules/commonPt" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing engagement module"
cd "$BASEDIR/packages/modules/engagement" &&  rm -rf node_modules &&  rm -rf dis && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing receipts module"
cd "$BASEDIR/packages/modules/receipts" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta

msg "Building and publishing hrms module"
cd "$BASEDIR/packages/modules/hrms" &&  rm -rf node_modules &&  rm -rf dist  && yarn build&&  npm publish --tag urban-2.9-beta

msg "Building and publishing ws module"
cd "$BASEDIR/packages/modules/ws" &&  rm -rf node_modules &&  rm -rf dist && yarn build &&  npm publish --tag urban-2.9-beta
