#!/bin/bash

echo '<?xml version="1.0" encoding="utf-8"?>' > build/quickurlmanager_upd.xml
echo '<update xmlns="http://ns.adobe.com/air/framework/update/description/1.0">' >> build/quickurlmanager_upd.xml
echo '  <version>'$(cat VERSION)'</version>' >> build/quickurlmanager_upd.xml
echo '  <url>http://luzifer.cc/updates/QuickURLManager-'$(cat VERSION.orig)'.air</url>' >> build/quickurlmanager_upd.xml
echo '  <description>' >> build/quickurlmanager_upd.xml
cat CHANGELOG >> build/quickurlmanager_upd.xml
echo '  </description>' >> build/quickurlmanager_upd.xml
echo '</update>' >> build/quickurlmanager_upd.xml
