#!/bin/bash
git diff HEAD~1 | grep 'git' | cut -d " " -f 3 | cut -d "/" -f 3 | uniq | sort -nr | xargs > servicelist
go get gopkg.in/yaml.v2
