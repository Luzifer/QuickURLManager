#!/bin/bash

# Copyright (c) 2010 Knut Ahlers 
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

echo '<?xml version="1.0" encoding="utf-8"?>' > build/quickurlmanager_upd.xml
echo '<update xmlns="http://ns.adobe.com/air/framework/update/description/1.0">' >> build/quickurlmanager_upd.xml
echo '  <version>'$(cat VERSION)'</version>' >> build/quickurlmanager_upd.xml
echo '  <url>http://luzifer.cc/updates/QuickURLManager-'$(cat VERSION.orig)'.air</url>' >> build/quickurlmanager_upd.xml
echo '  <description>' >> build/quickurlmanager_upd.xml
cat CHANGELOG >> build/quickurlmanager_upd.xml
echo '  </description>' >> build/quickurlmanager_upd.xml
echo '</update>' >> build/quickurlmanager_upd.xml
