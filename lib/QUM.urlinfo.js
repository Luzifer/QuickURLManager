/* 
 * Copyright (c) 2010 Knut Ahlers 
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (typeof QUM == "undefined") { var QUM = {}; }

QUM.urlinfo = function() {
  
  return {
    
    getTitleAndAddURL: function(url) {
      $('#addLoader').show();
      var loader = new air.URLLoader();
      var request = new air.URLRequest(url);
      loader.addEventListener(air.Event.COMPLETE, QUM.urlinfo.displayTitle);
      loader.load(request);
    },
    
    displayTitle: function(event) {
      var RegEx = /<title>(.*)<\/title>/;
      var loader = air.URLLoader(event.target);
      RegEx.exec(loader.data);
      
      if(RegExp.$1 == "") {
        var RegEx = /<TITLE>(.*)<\/TITLE>/;
        RegEx.exec(loader.data);
      }
      
      var title = RegExp.$1;
      air.trace(title);
      
      $('#urltitle').val(title);
      $('#urltitle').focus();
      $('#addLoader').hide();
    }
    
  }
  
}();