function Track(x, y, uid, name, image, container, $) {
	this.x = x;
	this.y = y;
	this.uid = uid;
	this.name = name;

	this.element = $('<div></div>').addClass('jxy_track').attr('id', 'jxy_track_' + uid);
	this.element.append($('<div></div>').addClass('jxy_track_arrow').html("&#9650;"));
	this.element.css({'left' : this.x, 'top' : this.y});
	
	var nameDisplay = $('<div></div>').addClass('jxy_name');
	nameDisplay.append($('<div></div>').addClass('jxy_image').append($('<img></img>').attr('src', image)));
	nameDisplay.append($('<div></div>').addClass('jxy_name_text').html(name));
	nameDisplay.append($('<div></div>').addClass('jxy_clear'));
	this.element.append(nameDisplay);

	this.container = container;
	$(container).append(this.element);
}

Track.prototype.remove = function($) {
	var click = $('<div></div>').addClass('jxy_static_click jxy_leave_click');
    click.css({left:this.x, top:this.y});
    $('body').append(click);
	$('#jxy_track_' + this.uid).remove();
}

Track.prototype.moveTo = function(x, y) {
	this.x = x;
	this.y = y;
	this.element.css({'left' : this.x, 'top' : this.y});
}

Track.prototype.click = function(x, y, $) {
	var click = $('<div></div>').addClass('jxy_click').attr('id', this.uid + '_' + x + '_' + y);
	click.css({'left' : this.x - 48, 'top' : this.y - 48});
	var clickInner = $('<div></div>').addClass('jxy_click_inner');
	$(click).append(clickInner);
	$(this.container).append(click);
	var uid = this.uid;
	setTimeout(function() {
		$('#' + uid + '_' + x + '_' + y).remove();
	}, 1900);
}