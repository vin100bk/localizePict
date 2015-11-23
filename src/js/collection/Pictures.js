/**
 * Represent a collection of pictures
 */
LocalizePict.Collection.Pictures = Backbone.Collection.extend(_.extend(
    LocalizePict.Collection.PicturesModule.Facebook, {
        /** Associated model */
        model: LocalizePict.Model.Picture,

        /**
         * @Override
         */
        add: function (models, options) {
            // @todo: handle duplicates on multiples providers
            LocalizePict.Collection.Pictures.__super__.add.apply(this, arguments);
        },

        /**
         * Save the collection
         */
        save: function () {
            this.sync('update', this.models);
        },

        /**
         * @Override
         */
        sync: function (method, model) {
            switch (method) {
                case 'read':
                    var picturesCollection = LocalizePict.Collection.Pictures.storageHandler.getItem(LocalizePict.Collection.Pictures.storageKey);
                    if (picturesCollection) {
                        this.reset(JSON.parse(picturesCollection));
                    }

                    break;

                case 'update':
                    LocalizePict.Collection.Pictures.storageHandler.setItem(LocalizePict.Collection.Pictures.storageKey, JSON.stringify(model));
                    break;
            }
        },

        /**
         * Order pictures by date descending
         */
        comparator: function (p1, p2) {
            var d1 = p1.get('date');
            var d2 = p2.get('date');

            if (!d1) {
                return 1;
            } else if (!d2) {
                return -1;
            } else {
                return (d1 == d2) ? 0 : (d1 < d2) ? 1 : -1;
            }
        },

        /**
         * Get pictures specified by location
         * @param latitude
         * @param longitude
         */
        getByLocation: function (latitude, longitude) {
            var pictures = _.filter(this.models, function (pict) {
                var location = pict.get('location');
                return location.latitude == latitude && location.longitude == longitude;
            });

            return new LocalizePict.Collection.Pictures(pictures);
        },

        /**
         * Remove pictures of a provider
         * @param provider: the provider name
         */
        removeProvider: function(provider) {
            var pictures = this.where({provider: provider});
            this.remove(pictures);
        }
    }), {
    /** The storage key */
    storageKey: 'pictures',

    /** Storage handler */
    storageHandler: sessionStorage,
});
