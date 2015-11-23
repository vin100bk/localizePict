/**
 * Map view
 */
LocalizePict.View.Map = LocalizePict.View.Abstract.extend({
    /** The Google Map object */
    map: null,

    /** Events */
    events: {
        'click a#add-pict-fb': 'addFbPictures',
        'click a#notices-close': 'closeNotices',
        'click a.remove-picts': 'removePicts'
    },

    /** Contains all markers */
    coordinates: {},

    /**
     * Initialize the application
     * @param options
     */
    initialize: function (options) {
        LocalizePict.View.Map.__super__.initialize.apply(this, [options]);

        // Init the model
        this.model = new LocalizePict.Collection.Pictures();
        this.model.on('update', this.update, this);
        this.model.on('reset', this.populateMap, this);

        _.bindAll(this, 'addFbPictures', 'closeNotices', 'removePicts', 'showPreview', 'goToPicture');
    },

    /**
     * Initial render
     */
    render: function () {
        // Render
        $('main').html(this.template('tplMap')());
        this.setElement($('#global'));

        // Init the map
        this.initMap();

        // Fetch initial data
        this.model.fetch();

        // Init provider buttons
        this.initProviderButtons();

        return this;
    },

    /**
     * Is the application rendered?
     * @returns {boolean}
     */
    isRendered: function () {
        return $('#global').length == 1;
    },

    /**
     * Init the map
     */
    initMap: function () {
        var map = $('#map');
        if (map.length == 1) {
            this.map = new google.maps.Map(map.get(0), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 2,
                keyboardShortcuts: false
            });
        }
    },

    /**
     * Update the application
     * @param pictures: models to update
     */
    update: function (pictures) {
        pictures = pictures || this.model;

        this.populateMap(pictures);
        pictures.save();
    },

    /**
     * Populate the map with pictures
     * @param pictures: the pictures
     */
    populateMap: function (pictures) {
        pictures = pictures || this.model;

        /**
         * Delete previous markers
         */
        for(coordinateKey in this.coordinates) {
            this.coordinates[coordinateKey].marker.setMap(null);
        }
        this.coordinates = {};

        /**
         * Create markers
         */
        var markersToUpdate = {};
        pictures.each(function (picture) {
            var coordinatesKey = picture.get('location').latitude + '|' + picture.get('location').longitude;

            // We notify this coordinate has to be updated
            markersToUpdate[coordinatesKey] = 1;

            if (!_.has(this.coordinates, coordinatesKey)) {
                // New location
                // Create the market with the longitude and latitude of the current picture
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(picture.get('location').latitude, picture.get('location').longitude),
                    map: this.map
                });

                this.coordinates[coordinatesKey] = {
                    marker: marker,
                    pictures: [picture]
                };
            } else {
                // A marker is already created for this location
                this.coordinates[coordinatesKey]['pictures'].push(picture);
            }
        }.bind(this));

        /**
         * Attach event on markers
         */
        for (var coordinateKey in markersToUpdate) {
            var infos = this.coordinates[coordinateKey];

            // Events
            google.maps.event.addListener(infos.marker, 'mouseover', this.showPreview.bind(null, infos.pictures));
            google.maps.event.addListener(infos.marker, 'mouseout', this.hidePreview);
            google.maps.event.addListener(infos.marker, 'click', this.goToPicture.bind(null, infos.pictures));

            // Title
            infos.marker.setTitle(infos.pictures.length + ' pictures');
        }
    },

    /**
     * Show pictures icon as preview
     * @param pictures
     */
    showPreview: function (pictures) {
        var preview = $('#preview');
        preview.empty();
        for (var i = 0; i < pictures.length; i++) {
            preview.append('<img src="' + pictures[i].get('icon') + '" alt="" />');

            if (i >= 5) {
                break;
            }
        }

        preview.removeClass('hidden');
    },

    /**
     * Hide the preview
     */
    hidePreview: function () {
        $('#preview').addClass('hidden');
    },

    /**
     * Go to the picture page
     * Redirect to the page of the first picture
     * @param pictures
     */
    goToPicture: function (pictures) {
        var picture = pictures[0];
        this.router.navigate('picture/' + picture.get('id'), {trigger: true});
    },

    /**
     * Show provider options
     * @param element: the element clicked
     */
    showProviderOptions: function (element) {
        var after = element.next();
        if (after.hasClass('providerOpts')) {
            // Options already inserted
            after.toggleClass('hidden');
        } else {
            element.after(this.template('tplProviderOpts')());
        }
    },

    /**
     * Init provider buttons (enable or disable them)
     */
    initProviderButtons: function () {
        if (this.model.findWhere({provider: 'fb'})) {
            // Facebook
            $('#add-pict-fb').addClass('active');
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
            this.showProviderOptions(element);
        } else {
            // Remove possible previous notices
            this.closeNotices();

            // Add an overlay over the notices
            this.addOverlayNotices();

            this.model.addFromFb(this)
                .progress(function (message) {
                    this.addNotice(message);
                })
                .done(function (message) {
                    this.removeOverlayNotices();
                    this.addNotice(message);
                    this.addCloseButtonToNotices();
                    element.addClass('active active-animated');
                })
                .fail(function (e) {
                    this.removeOverlayNotices();
                    this.showError(e.message + '<br />We are sorry for the inconvenience, please try again later.');
                });
        }
    },

    /**
     * Add a notice
     * @param text: notice text
     */
    addNotice: function (text) {
        var el = $('#notices');
        if (el.hasClass('hidden')) {
            el.removeClass('hidden');
        }

        el.append('<p>' + text + '</p>');
    },

    /**
     * Add a close button for notices
     */
    addCloseButtonToNotices: function () {
        $('#notices').append('<p class="center"><a href="#" id="notices-close">Ok</a></p>');
    },

    /**
     * Close notices
     */
    closeNotices: function (e) {
        if (e) {
            e.preventDefault();
        }

        var el = $('#notices');
        el.addClass('hidden');
        el.children('p').remove();
    },

    /**
     * Add an overlay over the notices
     */
    addOverlayNotices: function () {
        this.removeOverlayNotices();
        $('#notices').after('<div class="overlay" id="overlay-notices">' + this.template('tplSpinner')() + '</div>');
    },

    /**
     * Remove the notices overlay
     */
    removeOverlayNotices: function () {
        $('#overlay-notices').remove();
    },

    /**
     * Remove pictures
     * @param e
     */
    removePicts: function(e) {
        e.preventDefault();
        var element = $(e.currentTarget);
        this.model.removeProvider(element.data('provider'));
        element.parent().addClass('hidden');
        element.parent().prev().removeClass('active');
    }

});