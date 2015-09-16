/**
 * Module for adding pictures from Facebook
 */
LocalizePict.Collection.Provider.Facebook = {

    /**
     * Add pictures from Facebook to the collection
     */
    addFromFb: function () {
        var self = this;
        // We use a deferred for the process
        var deferred = $.Deferred();

        deferred.notify('Connecting to Facebook ...');

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
                            deferred.notify('Fetching pictures ...');

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
                                deferred.notify('<strong>' + json.data.length + '</strong> picture(s) found');

                                // Contains all pictures
                                var pictures = [];
                                // Browse all pictures
                                _.each(json.data, function (element, index, list) {
                                    if (_.has(element, 'id') && _.has(element, 'place') && _.has(element, 'picture') && _.has(element, 'source')) {
                                        /**
                                         * Mandatory fields: icon, pictures and location
                                         */
                                        var picture = new LocalizePict.Model.Picture({
                                            pid: element.id,
                                            provider: new LocalizePict.Model.FacebookProvider(),
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
                                            pictures.push(picture);
                                        }
                                    }
                                });

                                if (pictures.length > 0) {
                                    // Set new picture in the collection
                                    self.set(pictures);
                                    // Insertion succeed
                                    deferred.resolve('<strong>' + pictures.length + '</strong> geo-tagged picture(s) added');
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
};