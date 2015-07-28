/**
 * Represent a picture
 */
var Picture = Backbone.Model.extend({
    /**
     * Identifier attribute
     */
    idAttribute: 'id',

    /**
     * Construct a picture
     * @param attributes
     * @param options
     */
    initialize: function (attributes, options) {
        /**
         * Check mandatory fields
         */
        if (!_.has(attributes, 'pid')) {
            throw {
                name: 'PictureException',
                message: 'A picture has to have a pid'
            }
        }
        if (!_.has(attributes, 'icon')) {
            throw {
                name: 'PictureException',
                message: 'A picture has to have an icon'
            }
        }
        if (!_.has(attributes, 'picture')) {
            throw {
                name: 'PictureException',
                message: 'A picture has to have a picture field'
            }
        }
        if (!_.has(attributes, 'location')) {
            throw {
                name: 'PictureException',
                message: 'A picture has to have a location'
            }
        } else if (!_.isObject(attributes.location) || !_.has(attributes.location, 'latitude') || !_.has(attributes.location, 'longitude')) {
            throw {
                name: 'PictureException',
                message: 'The location is not valid'
            }
        }

        Picture.__super__.initialize.apply(this, [attributes, options]);
        this.generateId();
    },

    /**
     * Generate the ID from the picture ID and the provider prefix
     */
    generateId: function () {
        var id;
        if (_.has(this.attributes, 'provider')) {
            // If provider is in attributes, we use it to prefix the ID attribute
            id = this.get('provider').get('prefix') + this.get('pid');
        } else {
            // If not, id = pid (not recommended with multiple providers)
            id = this.get('pid');
        }

        this.set('id', id);
    }
});