/*
 * Application
 * The main object holding the logic for the app
 */

var Application = function() {
  
  var _dlg = null;
  var _ver = null;
  var _appUpdater = null;
  
  return {
    
    init: function() {
      var fs = new air.FileStream();
      var verFile = air.File.applicationDirectory;
      verFile = verFile.resolvePath("VERSION");
      fs.open(verFile, air.FileMode.READ);
      _ver = fs.readUTFBytes(fs.bytesAvailable);
      fs.close();
      $('.version').text(_ver);
      
      Application.initPosition();
      Application.setupEventListeners();
      Application.loadData();
      Application.startUpdater();
    },
    
    setupEventListeners: function() {
      window.nativeWindow.addEventListener(air.Event.CLOSING, Application.windowClosing);
      $(document).bind('keypress', Application.mainKeyListener);
      $('#getTitleBtn').bind('click', function(){
        QUM.urlinfo.getTitleAndAddURL($('#url').val());
      });
      $('#addURLBtn').bind('click', function(){
        var url = $('#url').val();
        var title = $('#urltitle').val();
        QUM.urlstore.addURL(url, title);
        Application.loadData();
        Application.hideDialog();
        $('#url').val('http://');
        $('#urltitle').val('');
      });
      $('.staticurl').bind('click', Application.staticURLClick);
      $('#url').bind('focus', function(){ $(this).select(); });
      $('#url').bind('keypress', function(e) { if(e.which == 13){ e.preventDefault(); $('#getTitleBtn').click(); } });
      $('#urltitle').bind('keypress', function(e){ if(e.which == 13){ e.preventDefault(); $('#addURLBtn').click(); } });
      $(document).bind('keydown', function(e){ if(e.keyCode == 27 && _dlg != null && _dlg.isVisible()) { Application.hideDialog(); } });
      $(document).bind('drop', function(e){ 
        var url = null;
        
        try {
          url = event.dataTransfer.getData("text/plain");
          air.trace(url);
        } catch(err) {
          try {
            url = event.dataTransfer.getData("text/html");
          } catch(err2) {air.trace(err2);}
        } 
        
        if(url == null)
          return;
        
        $('#url').val(url);
        $('#urltitle').val('');
        Application.showDialog($('#addurl'), 'URL hinzufügen');
        $('#getTitleBtn').click();
      });
      $(document).bind('dragenter', function(e){ e.preventDefault(); });
      $(document).bind('dragover', function(e){ e.preventDefault(); });
    },
    
    initPosition: function() {
      var position = QUM.datastore.getWindowPosition();

      if (position.maximized) {
        window.nativeWindow.maximize();
      } else {
        window.nativeWindow.x = position.x;
        window.nativeWindow.y = position.y;
        window.nativeWindow.width = position.width;
        window.nativeWindow.height = position.height;
      }

      window.nativeWindow.visible = true;
      window.nativeWindow.orderToFront();
    },
    
    windowClosing: function(e) {
      // save position
      QUM.datastore.setWindowPosition(
        window.nativeWindow.x,
        window.nativeWindow.y,
        window.nativeWindow.width,
        window.nativeWindow.height,
        window.nativeWindow.displayState == air.NativeWindowDisplayState.MAXIMIZED
      );
    },
    
    emptyDataArea: function() {
      $('.url').remove();
    },
    
    addURLToDataArea: function(urldata) {
      /*
      <div class="url">
        <a href="#" urlid="1" title="http://calendar.google.com/">Google Calendar</a>
        <a href="#" urlid="1" class="delete">x</a>
      </div>
      */
      var el = $('<div />');
      el.addClass('url');
      
      // var favicon = $('<img />');
      // favicon.attr('src', )
      
      var link = $('<a />');
      link.attr({'href' : '#', 'urlid' : urldata['id'], 'title' : urldata['url'], 'clickcount' : urldata['clicks']});
      link.text(urldata['title']);
      $(link).bind('click', Application.urlClicked);
      $(link).bind('mouseenter', Application.urlMouseover);
      $(link).bind('mouseleave', function(){ Application.setStatus(''); });
      
      var del = $('<a />');
      del.attr({'href' : '#', 'urlid' : urldata['id']});
      del.addClass('delete');
      del.text('x');
      $(del).bind('click', Application.delClicked);
      $(del).bind('mouseenter', function(){ Application.setStatus('Adresse löschen...'); });
      $(del).bind('mouseleave', function(){ Application.setStatus(''); });
      
      $([del, link]).appendTo(el);
      $('body').append(el);
    },
    
    loadData: function() {
      var urls = QUM.urlstore.getURLs();
      Application.emptyDataArea();
      for(var i = 0; i < urls.length; i++) {
        Application.addURLToDataArea(urls[i]);
      }
    },
    
    urlClicked: function(e) {
      QUM.urlstore.registerClick($(this).attr('urlid'));
      air.navigateToURL(new air.URLRequest($(this).attr('title')));
      Application.loadData();
      Application.setStatus('')
    },
    
    delClicked: function(e) {
      QUM.urlstore.delURL($(this).attr('urlid'));
      Application.loadData();
    },
    
    urlAddClick: function(e) {
      var url = $('#url').val();
      QUM.urlinfo.getTitleAndAddURL(url);
      $('#url').val('Neue URL...');
    },
    
    setStatus: function(status) {
      $('#statusbar').text(status);
    },
    
    urlMouseover: function(e) {
      var status = "("
      if($(this).attr('clickcount') != 'null')
        status = status + $(this).attr('clickcount');
      else
        status = status + "0";
      status = status + ") " + $(this).attr('title')
      Application.setStatus(status);
    },
    
    mainKeyListener: function(e) { 
      if(e.target.nodeName != 'INPUT' && e.target.nodeName != 'TEXTAREA') {
        air.trace(e.which);
        e.preventDefault();
        switch(e.which) {
          case 63: // ?
            Application.showDialog($('#appinfo'), 'Information');
            break;
          case 97: // a
            Application.showDialog($('#addurl'), 'URL hinzufügen');
            $('#url').focus();
            break;
          case 117: // u
            _appUpdater.checkNow();
            break;
        }
      }
    },
    
    showDialog: function(dlgelem, title) {
      if(_dlg == null || !_dlg.isVisible()) {
        _dlg = new Boxy(dlgelem, {'title' : title, 'closeText' : '[x]', 'modal' : true});
      }
    },
    
    hideDialog: function() {
      _dlg.hide();
      $('input').blur();
    },
    
    replaceDialog: function(dlgelem, title) {
      _dlg.hide();
      _dlg = new Boxy(dlgelem, {'title' : title, 'closeText' : '[x]', 'modal' : true});
    },
    
    staticURLClick: function(e) {
      e.preventDefault();
      air.navigateToURL(new air.URLRequest($(this).attr('href')));
    },
    
    sendFeedback: function(e) {
      var loader = new air.URLLoader();
      var req = new air.URLRequest('http://luzifer.cc/.feedbackform.rb');
      req.method = air.URLRequestMethod.POST;
      
      var vars = new air.URLVariables();
      vars['name'] = $('#feedback_name').val();
      vars['email'] = $('#feedback_email').val();
      vars['comment'] = $('#feedback_comment').val();
      vars['ver'] = _ver;
      
      req.data = vars;
      loader.load(req);
      Application.hideDialog();
      Boxy.alert('<p style="text-align:center;">Danke für das Feedback.</p>');
    },
    
    startUpdater: function() {
      _appUpdater = new runtime.air.update.ApplicationUpdaterUI();
      _appUpdater.configurationFile = new air.File("app:/vendor/update.xml");
      _appUpdater.initialize();
    },
    
  }
  
}();