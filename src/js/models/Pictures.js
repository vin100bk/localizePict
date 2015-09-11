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
        // We use a deferred for the process
        var deferred = $.Deferred();

        deferred.notify('connect');

        try {
            $.ajaxSetup({cache: true});
            $.getScript('//connect.facebook.net/en_US/sdk.js')
                .done(function () {
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
                            deferred.notify('fetch');

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

                                // Notice the total number of pictures
                                deferred.notify('nbTotalPicts', json.data.length);

                                // Contains all pictures
                                var pictures = [];
                                // Browse all pictures
                                _.each(json.data, function (element, index, list) {
                                    if (_.has(element, 'id') && _.has(element, 'place') && _.has(element, 'picture') && _.has(element, 'source')) {
                                        /**
                                         * Mandatory fields: icon, pictures and location
                                         */
                                        var picture = new Picture({
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
                                        });

                                        if (picture.isValid()) {
                                            // Picture valid
                                            deferred.notify('addValid', picture);
                                            pictures.push(picture);
                                        } else {
                                            // Picture invalid
                                            deferred.notify('addInvalid', picture);
                                        }
                                    }
                                });

                                if (pictures.length > 0) {
                                    // Set new picture in the collection
                                    self.set(pictures);
                                    // Insertion succeed
                                    deferred.resolve(pictures.length);
                                }
                            });
                        } else {
                            FB.login({scope: 'user_photos'});
                        }
                    });
                });
        }
        catch (e) {
            deferred.reject(e);
        }

        return deferred.promise();
    }
});