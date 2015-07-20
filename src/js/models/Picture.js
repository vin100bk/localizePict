/**
 * Represent a picture
 */
var Picture = Backbone.Model.extend({
    /**
     * Default values
     */
    defaults: {
        'provider':     null,
        'album':        null,
        'label':        null,
        'link':         null,
        'date':         null,
        // Mandatory fields so should not need to define default values but it's more clean
        'icon':         null,
        'picture':     null,
        'location':     null,
    },
});