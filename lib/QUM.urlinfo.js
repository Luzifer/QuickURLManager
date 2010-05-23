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