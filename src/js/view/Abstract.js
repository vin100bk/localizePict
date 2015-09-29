/**
 * Abstract view
 * Common methods for views
 */
LocalizePict.View.Abstract = Backbone.View.extend({

    /**
     * Render a template from its HTML ID
     * @param id: HTML ID
     * @returns the template string
     */
    template: function (id) {
        return _.template($('#' + id).html());
    }
});