/**
 * Error view
 */
LocalizePict.View.Error = LocalizePict.View.Abstract.extend({
    /** Events */
    events: {},

    /**
     * Initialize the view
     * @param options
     */
    initialize: function (options) {
        LocalizePict.View.Error.__super__.initialize.apply(this, [options]);
    },

    /**
     * Render the view
     */
    render: function (title, message, icon) {
        if (!icon) {
            icon = '<i class="fa fa-info-circle fa-5x"></i>';
        }

        // Render
        $('main').html(this.template('tplErrorPage')({title: title, message: message, icon: icon}));
        this.setElement($('#global-error'));

        return this;
    },

    /**
     * Render a 404 error page
     * @param path: the path of the page (optional)
     * @returns {LocalizePict.View.Error}
     */
    render404: function (path) {
        if (path) {
            this.render('Page not found', 'It seems the page you are looking for (<strong>' + path + '</strong>) does not exist.');
        } else {
            this.render('Page not found', 'It seems the page you are looking for does not exist.');
        }

        return this;
    }
});