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
        }
    }), {
    /** The storage key */
    storageKey: 'pictures',

    /** Storage handler */
    storageHandler: sessionStorage,
});
