#!/bin/bash

BASEDIR="$( cd "$( dirname "$0" )" && pwd )"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

msg "Building and publishing css"
cd "$BASEDIR/packages/css" && yarn publish --access public

msg "Building and publishing libraries"
cd "$BASEDIR/packages/libraries" && yarn publish --access public

msg "Building and publishing react-components"
cd "$BASEDIR/packages/react-components" && yarn publish --access public

msg "Building and publishing PGR module"
cd "$BASEDIR/packages/modules/pgr" && yarn publish --access public