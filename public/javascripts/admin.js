jQuery.noConflict();
window.hwclient = (function($){
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
    initAdmin();
    listenEvents();
  };

  var showLoader = function() {
    if($('.jxy_loader').length === 0) {
        var loader = $('<div></div>').addClass('jxy_loader');
        var inner = $('<div></div>').addClass('jxy_loader_inner');
        $(loader).append(inner);
        $('body').append(loader);
    } else {
        $('.jxy_loader').show();
    }
  };

  var hideLoader = function() {
    $('.jxy_loader').hide();
  };

  var showInsights = function() {
    showLoader();
    socket.emit('getinsights', {});
    socket.on('sendinsights', handleInsightsReceieve);
    $('.jxy_track, .jxy_static_click').hide();
  };

  var hideInsights = function() {
    if(showingInsights) {
        showingInsights = false;
        heatmap.store.setDataSet({max:0, data:{}});
        $('.jxy_track, .jxy_static_click').show();
    }
  };

  var handleInsightsReceieve = function(data) {
    showingInsights = true;
    createHeatmap();
    heatmap.store.setDataSet(data);
    hideLoader();
  };

  var initAdmin = function() {
    socket.emit('init', {'uid' : uid, 'role' : 'admin'});
    drawOverlay();
    createHeatmap();
    createAdminBar();
    $(window).resize(function() {
        if(Math.abs($(window).width() - 1350) < 10) {
            console.log('Good');
        }
    });
  };

  var drawOverlay = function() {
    if($('.jxy_overlay').length === 0) {
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
  };

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
        divWithClass('jxy_admin_bar_count_label').html('Users:')).append(
        divWithClass('jxy_admin_bar_count_number').attr('id', 'jxy_admin_bar_count').html(0));
    adminBarSections[4] = divWithClass('jxy_admin_bar_insights jxy_admin_bar_section jxy_admin_bar_section_nopad jxy_admin_bar_section_last').append(divWithClass('jxy_logo jxy_glass_logo'));
    adminBarSections[4].append(divWithClass('jxy_admin_bar_insights_text').html('Show Insights').click(handleInsightClick));
    $.each(adminBarSections, function(idx, value) {
        $(adminBar).append(value);
    });
    $('.jxy_overlay').append(adminBar);
    $('.jxy_admin_bar input[type=checkbox]').iphoneStyle({onChange:handleToggleChange});
  };

  var handleToggleChange = function(elem, value) {
    if(elem.attr('id') == 'jxy_toggle_map') {
        if(realtimeHeatmap) {
            heatmap.store.setDataSet({max:0, data:{}});
        }
        realtimeHeatmap = !realtimeHeatmap;
    } else {
        if(value) {
            $('.jxy_overlay_inner, .jxy_heatmap, .jxy_static_click').show();
        } else {
            $('.jxy_overlay_inner, .jxy_heatmap, .jxy_static_click').hide();
        }
    }
  };

  var handleInsightClick = function() {
    if(showingInsights) {
        hideInsights();
        $('.jxy_admin_bar_insights_text').html('Show Insights');
    } else {
        showInsights();
        $('.jxy_admin_bar_insights_text').html('Hide Insights');
    }
  };

  var listenEvents = function() {
    socket.on('moved', handleMove);
    socket.on('reconnect', initAdmin);
    socket.on('disconnected', handleDisconnected);
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
        clientCount -= 1;
        $('#jxy_admin_bar_count').html(clientCount);
    }
  };

  function getPosition(data) {
    var x = data.x;
    var clientMax = data.maxw;
    var adminMax = $(window).width();
    var diff = Math.abs(adminMax - clientMax) / 2 * (adminMax > clientMax ? 1 : -1);
    data.x = x + diff;
    return data;
  }

  function payload(event, click) {
    return {
      x : event.pageX,
      y : event.pageY,
      c : click,
      u : uid,
      maxw : $(window).width()
    };
  }

  function divWithClass(className) {
    return $('<div></div>').addClass(className);
  }

	console.log('admin loaded...');
  return self;
})(jQuery);