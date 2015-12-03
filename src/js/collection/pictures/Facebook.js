/**
 * Module for adding pictures from Facebook
 */
LocalizePict.Collection.PicturesModule.Facebook = {

    /**
     * Add pictures from Facebook to the collection
     * @param context: application context
     */
    addFromFb: function (context) {
        // Global deferred
        var deferred = $.Deferred();

        deferred.notifyWith(context, ['Connecting to Facebook ...']);

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
                        deferred.rejectWith(context, ['Error while connecting to Facebook.']);
                        return;
                    }

                    if (response.status === 'connected') {
                        this.fetchPicturesFromFb(deferred, context);
                    } else if (response.status === 'not_authorized') {
                        deferred.rejectWith(context, ['You have not authenticated this application into Facebook.']);
                    } else {
                        FB.login(function (response) {
                            if (response.authResponse) {
                                this.fetchPicturesFromFb(deferred, context);
                            } else {
                                deferred.rejectWith(context, ['Error while login to Facebook.']);
                            }
                        }.bind(this), {scope: 'user_photos'});
                    }
                }.bind(this));
            }.bind(this));

        return deferred.promise();
    },

    /**
     * Fetch pictures from Facebook
     * @param deferred: the process promise
     * @param context: application context
     * @returns {*}
     */
    fetchPicturesFromFb: function (deferred, context) {
        deferred.notifyWith(context, ['Fetching pictures ...']);

        /**
         * Tagged pictures
         */
        var deferredTagged = this.getPicturesFromFb('/me/photos/');
        deferredTagged.promise()
            .done(function (pictures) {
                if (pictures.length > 0) {
                    // Add new picture in the collection
                    this.add(pictures);
                    deferred.notifyWith(context, ['<strong>' + pictures.length + '</strong> tagged picture(s) added']);
                }
            }.bind(this));

        /**
         * Uploaded pictures
         */
        var deferredUploaded = this.getPicturesFromFb('/me/photos/?type=uploaded');
        deferredUploaded.promise()
            .done(function (pictures) {
                if (pictures.length > 0) {
                    // Add new picture in the collection
                    this.add(pictures);
                    deferred.notifyWith(context, ['<strong>' + pictures.length + '</strong> uploaded picture(s) added']);
                }
            }.bind(this));

        /**
         * When both are resolved, we notify it
         * I prefer to set pictures not at the end in case of errors
         */
        $.when(deferredTagged, deferredUploaded)
            .done(function (taggedPicts, uploadedPicts) {
                var nbPicts = taggedPicts.length + uploadedPicts.length;
                deferred.resolveWith(context, ['Total: <strong>' + nbPicts + '</strong> picture(s) added !']);
            })
            .fail(function (message) {
                deferred.rejectWith(context, [message]);
            });
    },

    /**
     * Fetch pictures from an URL
     * @param url
     */
    getPicturesFromFb: function (url) {
        var deferred = $.Deferred();

        FB.api(url, 'get', {
            limit: 500,
            //fields: 'place,album,picture,images,place,name,link,created_time'
        }, function (json) {
            // Check JSON
            if (!_.has(json, 'data')) {
                deferred.reject('Error while retrieving pictures from Facebook.');
                return;
            }

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
                        provider: 'fb',
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

            // Manage pages
            if (_.has(json, 'paging') && _.has(json.paging, 'next')) {
                // We have a next page, let's fetch pictures from this next page
                this.getPicturesFromFb(json.paging.next).promise()
                    .then(function (picts) {
                        picts = picts.concat(pictures);
                        deferred.resolve(picts);
                    });
            } else {
                // Last page: returns pictures
                deferred.resolve(pictures);
            }
        }.bind(this));

        // We just return the raw deferred, because we use a "when" onto it
        return deferred;
    }
};