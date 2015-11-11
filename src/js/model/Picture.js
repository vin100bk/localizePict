/**
 * Represent a picture
 */
LocalizePict.Model.Picture = Backbone.Model.extend({
    /**
     * Identifier attribute
     */
    idAttribute: 'id',

    /**
     * Construct a picture
     * @param attributes
     * @param options
     */
    constructor: function (attributes, options) {
        LocalizePict.Model.Picture.__super__.constructor.apply(this, [attributes, $.extend(options, {parse: true})]);
    },

    /**
     * Set data for this picture
     * @param attributes
     * @param options
     */
    set: function(attributes, options) {
        LocalizePict.Model.Picture.__super__.set.apply(this, [attributes, $.extend(options, {validate: true})]);
    },

    /**
     * Parse a picture
     * Add its ID
     * @param picture: picture data
     * @param options
     * @returns the picture with its ID
     */
    parse: function(picture, options) {
        if (_.has(picture, 'provider')) {
            // If provider is in attributes, we use it to prefix the ID attribute
            picture.id = picture.provider + '_' + picture.pid;
        } else {
            // If not, id = pid (not recommended with multiple providers)
            picture.id = picture.pid;
        }

        return picture;
    },

    validate: function (attributes, options) {
        /**
         * Check mandatory fields
         */
        if (!_.has(attributes, 'pid')) {
            return {
                name: 'PictureException',
                message: 'A picture has to have a pid'
            }
        }
        if (!_.has(attributes, 'icon')) {
            return {
                name: 'PictureException',
                message: 'A picture has to have an icon'
            }
        }
        if (!_.has(attributes, 'picture')) {
            return {
                name: 'PictureException',
                message: 'A picture has to have a picture field'
            }
        }
        if (!_.has(attributes, 'location')) {
            return {
                name: 'PictureException',
                message: 'A picture has to have a location'
            }
        } else if (!_.isObject(attributes.location) || !_.has(attributes.location, 'latitude') || !_.has(attributes.location, 'longitude')) {
            return {
                name: 'PictureException',
                message: 'The location is not valid'
            }
        }
    }
});