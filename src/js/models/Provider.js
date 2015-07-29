/**
 * Represent a provider
 */
var Provider = Backbone.Model.extend({

});

/**
 * Facebook
 */
var FacebookProvider = Provider.extend({
    /**
     * Facebook values
     */
    defaults: {
        'id': 'fb',
        'order': 1,
        'prefix': 'fb_'
    },
});