/**
 * Represent a provider
 */
LocalizePict.Model.Provider = Backbone.Model.extend({

});

/**
 * Facebook
 */
LocalizePict.Model.FacebookProvider = LocalizePict.Model.Provider.extend({
    /**
     * Facebook values
     */
    defaults: {
        'id': 'fb',
        'order': 1,
        'prefix': 'fb_'
    },
});