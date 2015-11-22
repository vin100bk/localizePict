/**
 * Application router
 */
LocalizePict.Router.Router = Backbone.Router.extend({

    /** Application */
    app: null,

    /** Applications routes */
    routes: {
        '': 'index',
        'picture/:pictureId': 'picture',
        '*path': 'default'
    },

    /**
     * Initialize the router
     */
    initialize: function() {
        this.app = new LocalizePict.View.Map({router: this});
    },

    /**
     * Homepage
     */
    index: function() {
        this.app.render();
    },

    /**
     * Show a picture
     * @param pictureId: the picture ID
     */
    picture: function(pictureId) {
        if(!this.app.isRendered()) {
            // If the app is not rendered, we do it
            this.app.render();
        }

        // Hide the preview
        this.app.hidePreview();

        // Add an overlay
        this.app.showGlobalOverlay();

        try {
            var pictureView = new LocalizePict.View.Picture({router: this});
            pictureView.render(pictureId, this.app.model);
        } catch(e) {
            if('name' in e && e.name == 'PictureException') {
                // Picture not found
                this.default(pictureId);
            } else {
                throw e;
            }
        }

    },

    /**
     * Page not found
     * @param path: path searched
     */
    default: function(path) {
        var errorView = new LocalizePict.View.Error({router: this});
        errorView.render404(path);
    }
});