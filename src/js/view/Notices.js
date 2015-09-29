/**
 * Notices view
 */
LocalizePict.View.Notices = LocalizePict.View.Abstract.extend({
    /** Root element */
    el: '#notices',

    /** Events */
    events: {
        'click a#notices-close': 'closeNotices'
    },

    /**
     * Add a notice
     * @param text: notice text
     */
    addNotice: function (text) {
        var el = $(this.el);
        if (el.hasClass('hidden')) {
            el.removeClass('hidden');
        }

        el.append('<p>' + text + '</p>');
    },

    /**
     * Add a close button for notices
     */
    addCloseButtonToNotices: function () {
        $(this.el).append('<p class="center"><a href="#" id="notices-close">Ok</a></p>');
    },

    /**
     * Close notices
     */
    closeNotices: function (e) {
        if(e) {
            e.preventDefault();
        }

        var el = $(this.el);
        el.addClass('hidden');
        el.children('p').remove();
    },

    /**
     * Add an overlay over the notices
     */
    addOverlay: function() {
        this.removeOverlay();
        $(this.el).after('<div class="overlay overlay-notices">' + this.template('tplSpinner')() + '</div>');
    },

    /**
     * Remove the notices overlay
     */
    removeOverlay: function() {
        $('.overlay-notices').remove();
    }
});