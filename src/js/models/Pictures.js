/**
 * Represent a collection of pictures
 */
var Pictures = Backbone.Collection.extend({
    /** Associated model */
    model: Picture,

    /**
     * Add pictures from Facebook to the collection
     */
    addFromFb: function () {
        var self = this;
        $.ajaxSetup({cache: true});
        $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
            // Connexion
            FB.init({
                appId: '904308072941010',
                version: 'v2.3'
            });

            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.api('/me/photos', 'get', {
                        limit: 500,
                        date_format: 'U'
                        //fields: 'place,album,picture,images,place,name,link,created_time'
                    }, function (data) {
                        // Contains all pictures
                        var pictures = [];

                        // Browse all pictures
                        _.each(data.data, function (element, index, list) {
                            if (_.has(element, 'place')) {
                                // The picture has a place. Other pictures are not interesting for us
                                pictures.push(new Picture({
                                    provider: {},
                                    album: element.album,
                                    icon: element.picture,
                                    pictures: element.images,
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
                                }));
                            }
                        });

                        // Reset the collection with the new photos list (@todo: handle several providers)
                        self.reset(pictures);
                    });
                } else {
                    FB.login({scope: 'user_photos'});
                }
            });
        });

    },
});