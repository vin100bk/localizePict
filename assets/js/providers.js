Providers = {
	facebook: {
		addPictures: function(collection) {		
			$.ajaxSetup({ cache: true });
			$.getScript('//connect.facebook.net/en_US/sdk.js', function(){
				FB.init({
					appId: '904308072941010',
					version: 'v2.3'
				});
				
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
						FB.api('/me/photos', 'get', {
							limit: 500,
							//fields: 'place,album,picture,images,place,name,link,created_time'
						}, function(data) {
							var photos = [];
							_.each(data.data, function(element, index, list) {
								if(_.has(element, 'place')) {
									photos.push({
										provider: Providers.facebook.getInfos(),
										album: element.album,
										icon: element.picture,
										picture: function() {
											var pic = element.images[0];
											for(var i = 1; i < element.images.length; i++) {
												if(element.images[i].width > pic.width) {
													pic = element.images[i];
												}
											}
											return pic;
										},
										location: {
											latitude: element.place.location.latitude,
											longitude: element.place.location.longitude,
											label: element.place.name,
											city: element.place.location.city,
											country: element.place.location.country
										},
										label: element.name,
										link: element.link,
										date: element.created_time
									});
								}
							});
							
							collection.reset(photos);
						});
					} else {
						FB.login({scope: 'user_photos'});
					}
				});
			});
		},
		
		getInfos: function() {
			return {};
		}
	}
};