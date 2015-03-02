function CustomMarker(latlng, map, args) {
	this.latlng = latlng;
	this.args = args;
	this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.getArgs = function() {
  return this.args;
}

CustomMarker.prototype.draw = function() {

	var self = this;

	var div = this.div;

	if (!div) {

		div = this.div = document.createElement('div');

		div.className = 'marker';

		div.style.position = 'absolute';
		div.style.cursor = 'pointer';
    	div.innerHTML = this.args.dataset.StartTime;
		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}

		google.maps.event.addDomListener(div, "click", function(event) {
			console.log("original event is ");
			console.log(event);
			google.maps.event.trigger(self.map, "markerclick", {
                                      latLng: new google.maps.LatLng(0, 0),
                                      arg:self.args
                                        });
		});

		google.maps.event.addDomListener(div, "mouseenter", function(event) {
			//console.log("original hover evt is ");
			//console.log(event);
			google.maps.event.trigger(self.map, "markerhover", {
                                      latLng: new google.maps.LatLng(0, 0),
                                      arg:self.args,
                                      evt:event
                                        });
			event.stopPropagation();
		});

		google.maps.event.addDomListener(div, "mouseleave", function(event) {
			//console.log("mouse out ");
			//console.log(event);
			google.maps.event.trigger(self.map, "markerhoverexit", {
                                      latLng: new google.maps.LatLng(0, 0),
                                      arg:self.args,
                                      evt:event
                                        });
			event.stopPropagation();
		});


		var panes = this.getPanes();
		console.log("panes");
		console.log(panes);
		panes.overlayMouseTarget.appendChild(div);
	}

	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

	if (point) {
		div.style.left = point.x + 'px';
		div.style.top = point.y + 'px';
	}
};

CustomMarker.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}
};

CustomMarker.prototype.getPosition = function() {
	return this.latlng;
};
