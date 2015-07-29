/**
 * Represent a collection of pictures
 */
var Pictures = Backbone.Collection.extend({
    /** Associated model */
    model: Picture,

    /**
     * @Override
     * Trigger an event after set operation
     */
    set: function () {
        // @todo: handle duplicates on multiples providers
        Pictures.__super__.set.apply(this, arguments);
        this.trigger('set');
    },

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
                if (!_.has(response, 'status')) {
                    throw {
                        name: 'ConnexionException',
                        message: 'Error while connecting to Facebook.'
                    }
                }

                if (response.status === 'connected') {
                    FB.api('/me/photos', 'get', {
                        limit: 500,
                        date_format: 'U'
                        //fields: 'place,album,picture,images,place,name,link,created_time'
                    }, function (json) {
                        // Check JSON
                        if (!_.has(json, 'data')) {
                            throw {
                                name: 'JsonException',
                                message: 'Error while retrieving pictures from Facebook.'
                            }
                        }
                        // Contains all pictures
                        var pictures = [];
                        // Browse all pictures
                        _.each(json.data, function (element, index, list) {
                            if (_.has(element, 'id') && _.has(element, 'place') && _.has(element, 'picture') && _.has(element, 'source')) {
                                /**
                                 * Mandatory fields: icon, pictures and location
                                 */
                                pictures.push(new Picture({
                                    pid: element.id,
                                    provider: new FacebookProvider(),
                                    album: element.album,
                                    icon: element.picture,
                                    picture: element.source,
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

                        if (pictures.length > 0) {
                            // Set new picture in the collection
                            self.set(pictures);
                        }
                    });
                } else {
                    FB.login({scope: 'user_photos'});
                }
            });
        });
    }
});