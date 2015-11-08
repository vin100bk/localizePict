/**
 * Abstract view
 * Common methods for views
 */
LocalizePict.View.Abstract = Backbone.View.extend({

    /** The router */
    router: null,

    /**
     * Initialize the application
     * @param options
     */
    initialize: function (options) {
        if(_.has(options, 'router')) {
            this.router = options.router;
        }

        _.bindAll(this, 'closeError');
    },

    /**
     * Render a template from its HTML ID
     * @param id: HTML ID
     * @returns the template string
     */
    template: function (id) {
        var tpl = $('#' + id);
        if(tpl.length == 0) {
            throw {
                name: 'ViewException',
                message: 'The template "' + id + '" does not exist.'
            }
        }
        return _.template(tpl.html());
    },

    /**
     * Show an error
     * @param message: the error message
     */
    showError: function(message) {
        this.closeError();
        this.showGlobalOverlay();
        $('main').append(this.template('tplError')({message: message}));

        // Attach the event
        $('#error .button-submit').on('click', this.closeError);
    },

    /**
     * Close the error message
     */
    closeError: function() {
        this.closeGlobalOverlay();
        $('#error').remove();
    },

    /**
     * Show a global overlay
     */
    showGlobalOverlay: function() {
        this.closeGlobalOverlay();
        $('main').append('<div class="overlay" id="overlay-global"></div>');
    },

    /**
     * Close the global overlay
     */
    closeGlobalOverlay: function() {
        $('#overlay-global').detach();
    }
});