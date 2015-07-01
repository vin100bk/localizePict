(function($){
	var Photo = Backbone.Model.extend({
	});
	
	var Photos = Backbone.Collection.extend({
		model: Photo,
		
		initialize: function() {
			
		}
	});
	
	var LocalizePict = Backbone.View.extend({
		el: $('body'),

		events: {
			'click a#addPictFb': 'addPicturesFb',
		},

		initialize: function() {
			this.model = new Photos();
			this.listenTo(this.model, 'reset', this.render);
			this.render();
		},

		render: function() {
			this.renderMap();
			this.renderSiteBar();
		},
		
		renderMap: function() {
			var mapOptions = {
			  center: { lat: -34.397, lng: 150.644},
			  zoom: 2
			};
			var map = new google.maps.Map(document.getElementById('map'), mapOptions);
						
			this.model.each(function(photo) {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(photo.attributes.location.latitude, photo.attributes.location.longitude),
					map: map,
				});
				
				google.maps.event.addListener(marker, 'click', function() {
					console.log('click');
				});

	
				
				google.maps.event.addListener(marker, 'mouseout', function() {
					console.log('mouseout');
				});
			});
		},
		
		renderSiteBar: function() {
			$('#sidebar').append('<a href="#" id="addPictFb">+ Fb</a>');
		},
		
		addPicturesFb: function(e) {
			e.preventDefault();
			Providers.facebook.addPictures(this.model);
		}
	});
	
	var lp = new LocalizePict();
})(jQuery);