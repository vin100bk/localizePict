/**
 * Actions views
 */
LocalizePict.View.Actions = LocalizePict.View.Abstract.extend({
    /** Root element */
    el: '#actions',

    /** Events */
    events: {
        'click a#add-pict-fb': 'addFbPictures'
    },

    /** The notices view */
    noticesView: null,

    /**
     * Show provider options
     * @param element: the element clicked
     */
    showOptionsProvider: function (element) {
        var after = element.next();
        if (after.hasClass('providerOpts')) {
            // Options already inserted
            after.toggle();
        } else {
            element.after(this.template('tplProviderOpts'));
        }
    },

    /**
     * Callback when a user want to add Facebook pictures
     */
    addFbPictures: function (e) {
        e.preventDefault();

        // Clicked element
        var element = $(e.currentTarget);

        if (element.hasClass('active')) {
            // Pictures already added
            this.showOptionsProvider(element);
        } else {
            var noticesView = this.getNoticesView();

            // Remove possible previous notices
            noticesView.closeNotices();

            var self = this;
            this.model.addFromFb()
                .progress(function (key, data) {
                    switch (key) {
                        case 'connect':
                            noticesView.addNotice('Connecting to Facebook ...');
                            break;

                        case 'fetch':
                            noticesView.addNotice('Fetching pictures ...');
                            break;

                        case 'nbTotalPicts':
                            noticesView.addNotice('<strong>' + data + '</strong> picture(s) found');
                            break;
                    }
                })
                .done(function (data) {
                    noticesView.addNotice('<strong>' + data + '</strong> geo-tagged picture(s) added');
                    noticesView.addCloseButtonToNotices();
                    element.addClass('active');
                })
                .fail(function () {

                });
        }
    },

    /**
     * Get the noticesView
     * Implements Singleton pattern
     */
    getNoticesView: function() {
        if(this.noticesView == null) {
            this.noticesView = new LocalizePict.View.Notices();
        }

        return this.noticesView;
    }
});