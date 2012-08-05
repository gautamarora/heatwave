jQuery.noConflict();
window.jxy = (function($){
  var self = {};

  var isAdmin = false;

  var clients = {};
  var socket = {};
  var uid = '';
  var heatmap = null;
  var clientCount = 0;
  var showingInsights = false;
  var realtimeHeatmap = false;

  self.init = function(options) {
    socket = io.connect(options.host + ':' + options.port);
    uid = options.uid;
    if(options.insights == 0) {
        if(options.role == 'client') {
          initClient();
        } else if(options.role == 'admin') {
          initAdmin();
        }
        listenEvents();
    } else {
        drawOverlay();
        showInsights();
    }     
  };

  var showInsights = function() {
    socket.emit('getinsights', {});
    socket.on('sendinsights', handleInsightsReceieve);
  };

  var hideInsights = function() {
    if(showingInsights) {
        showingInsights = false;     
        heatmap.store.setDataSet({max:0, data:{}});
    }
  }

  var handleInsightsReceieve = function(data) {
    showingInsights = true;
    createHeatmap();
    heatmap.store.setDataSet(data);
  };

  var initClient = function() {
    socket.emit('init', {'uid' : uid, 'role' : 'client'});
  };

  var initAdmin = function() {
    socket.emit('init', {'uid' : uid, 'role' : 'admin'});
    isAdmin = true;
    drawOverlay();
    createHeatmap();
    createAdminBar();
  };

  var drawOverlay = function() {
    if($('.jxy_overlay').length == 0) {
        var overlay = divWithClass('jxy_overlay');
        var overlay_inner = divWithClass('jxy_overlay_inner');
        var overlay_heatmap = divWithClass('jxy_heatmap');
        $(overlay).append(overlay_heatmap);
        $(overlay).append(overlay_inner);
        $('body').append(overlay);
    }   
  };

  var createHeatmap = function() {
    if(!heatmap) {
        heatmap = h337.create({'element' : $('.jxy_heatmap')[0], 'radius' : 25, 'visible' : true});
    }
  }

  var createAdminBar = function() {
    var adminBar = divWithClass('jxy_admin_bar');
    var adminBarSections = [];
    adminBarSections[0] = divWithClass('jxy_admin_bar_logo jxy_admin_bar_section jxy_admin_bar_section_first').append(
        divWithClass('jxy_logo jxy_fire_logo'));
    adminBarSections[1] = divWithClass('jxy_admin_bar_enabled jxy_admin_bar_section').append(
        divWithClass('jxy_toggle_label').html('HeatWave')).append(
            divWithClass('jxy_toggle').append(
                $('<input></input>').attr('type', 'checkbox').attr('id', 'jxy_toggle_main').attr('checked','checked')));
    adminBarSections[2] = divWithClass('jxy_admin_bar_heatmap jxy_admin_bar_section jxy_admin_bar_section_nopad').append(divWithClass('jxy_logo jxy_map_logo'));
    adminBarSections[2].append(
        divWithClass('jxy_toggle_label').html('Map')).append(
            divWithClass('jxy_toggle').append(
                $('<input></input>').attr('type', 'checkbox').attr('id', 'jxy_toggle_map')));
    adminBarSections[3] = divWithClass('jxy_admin_bar_count jxy_admin_bar_section').append(
        divWithClass('jxy_admin_bar_count_label').html('Count:')).append( 
        divWithClass('jxy_admin_bar_count_number').attr('id', 'jxy_admin_bar_count').html(0));
    adminBarSections[4] = divWithClass('jxy_admin_bar_insights jxy_admin_bar_section jxy_admin_bar_section_nopad jxy_admin_bar_section_last').append(divWithClass('jxy_logo jxy_glass_logo'));
    adminBarSections[4].append(divWithClass('jxy_admin_bar_insights_text').html('Show Insights').click(handleInsightClick));
    $.each(adminBarSections, function(idx, value) {
        $(adminBar).append(value);
    });
    $('.jxy_overlay').append(adminBar);
    $('.jxy_admin_bar input[type=checkbox]').iphoneStyle({onChange:handleToggleChange});
  }

  var handleToggleChange = function(elem, value) {
    if(elem.attr('id') == 'jxy_toggle_map') {
        realtimeHeatmap = !realtimeHeatmap;
    } else {
        if(value) {
            $('.jxy_overlay_inner, .jxy_heatmap').show();
        } else {
            $('.jxy_overlay_inner, .jxy_heatmap').hide();
        }
    }
  }

  var handleInsightClick = function() {
    if(showingInsights) {
        hideInsights();
        $('.jxy_admin_bar_insights_text').html('Show Insights');
    } else {
        showInsights();
        $('.jxy_admin_bar_insights_text').html('Hide Insights');
    }
  }

  var listenEvents = function() {
    if(!isAdmin) {
      socket.on('start', handleStart);
      socket.on('end', handleEnd);
      socket.on('disconnect', handleEnd);
      socket.on('reconnect', initClient);
    } else {
      socket.on('moved', handleMove);
      socket.on('reconnect', initAdmin);
      socket.on('disconnected', handleDisconnected)
    }
  };

  var handleStart = function(data) {
    $(document).on('click', function(event) {
      socket.emit('move', payload(event, true));
    });
    $(document).on('mousemove', function(event) {
      socket.emit('move', payload(event, false));
    });
  };

  var handleEnd = function(data) {
    $(document).off('click');
    $(document).off('mousemove');
  };

  var handleMove = function(data) {
    var move = getPosition(data.data);
    var user = data.who;
    if(!(user.uid in clients)) {
      var track = new Track(move.x, move.y, user.uid, user.uname, user.uimg, 'body', $);
      clients[user.uid] = track;
      clientCount += 1;
      $('#jxy_admin_bar_count').html(clientCount);
    } else {
      if(move.c) {
        clients[user.uid].click(move.x, move.y, $);
        insertClick(move.x, move.y);
      } else {
        clients[user.uid].moveTo(move.x, move.y);
      }
    }
    if(realtimeHeatmap){ 
        heatmap.store.addDataPoint(move.x, move.y);
    }
  };

  var insertClick = function(x, y) {
    var click = $('<div></div>').addClass('jxy_static_click');
    click.css({left:x, top:y});
    $('body').append(click);
  };

  var handleDisconnected = function(data) {
    if(data.who.uid in clients) {
        clients[data.who.uid].remove($);
        delete clients[data.who.uid];
    }
  };

  function getPosition(data) {
    var x = data.x;
    var clientMax = data.maxw;
    var adminMax = $(window).width();
    var diff = Math.abs(adminMax - clientMax) / 2 * (adminMax > clientMax ? 1 : -1);
    data.x = x + diff;
    return data;
  };

  function payload(event, click) {
    return {
      x : event.pageX,
      y : event.pageY,
      c : click,
      u : uid,
      maxw : $(window).width()
    };
  };

  function divWithClass(className) {
    return $('<div></div>').addClass(className);
  }

  return self;
})(jQuery);