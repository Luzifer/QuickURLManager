#!/bin/bash
cp VERSION VERSION.orig
sed "s/DEV/DEV Build $(date +"%m%d%H%M")/" VERSION.orig > VERSION
cp QuickURLManager-app.xml QuickURLManager-app.xml.orig
sed "s/__VER__/$(cat VERSION)/" QuickURLManager-app.xml.orig > QuickURLManager-app.xml