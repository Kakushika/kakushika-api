#!/bin/bash
git config --global user.email "hostmaster@kksk.io"
git config --global user.name "CircleCI"

cd deployment
git add .
git commit -am "Circle CI #$CIRCLE_BUILD_NUM"
git push origin master 