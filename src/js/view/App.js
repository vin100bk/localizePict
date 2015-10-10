/**
 * Main view
 */
LocalizePict.View.App = LocalizePict.View.Abstract.extend({
    /** Root element */
    el: '#map',

    /** The Google Map object */
    map: null,

    /** Map: [coordinate] = {marker, [pictures]} */
    coordinates: {},

    /** Events */
    events: {},

    /**
     * Initialize the application
     */
    initialize: function () {
        // Init the model
        this.model = new LocalizePict.Collection.Pictures();
        this.model.on('set', this.update, this);

        // Render the map
        this.render();

        // Init the actions view
        new LocalizePict.View.Actions({model: this.model});

        _.bindAll(this, 'showPreview');
    },

    /**
     * Init the map
     */
    initMap: function () {
        var mapOptions = {
            center: {lat: -34.397, lng: 150.644},
            zoom: 2
        };

        if ($(this.el).length == 1) {
            this.map = new google.maps.Map($(this.el).get(0), mapOptions);
        }
    },

    /**
     * Initial render
     */
    render: function () {
        this.initMap();
        return this;
    },

    /**
     * Update the application
     * @param pictures: models to update
     */
    update: function (pictures) {
        pictures = pictures || this.model;

        /**
         * Create markers
         */
        var markersToUpdate = {};
        for(var i = 0; i < pictures.length; i++) {
            var picture = pictures[i];
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
        }

        /**
         * Attach event on markers
         */
        for(var coordinateKey in markersToUpdate) {
            var infos = this.coordinates[coordinateKey];

            // Events
            google.maps.event.addListener(infos.marker, 'mouseover', this.showPreview.bind(null, infos.pictures));
            google.maps.event.addListener(infos.marker, 'mouseout', this.hidePreview);

            // Title
            infos.marker.setTitle(infos.pictures.length + ' pictures');
        }
    },

    /**
     * Show pictures icon as preview
     * @param pictures
     */
    showPreview: function(pictures) {
        var preview = $('#preview');
        preview.empty();
        for(var i = 0; i < pictures.length; i++) {
            preview.append('<img src="' + pictures[i].get('icon') + '" alt="" />');

            if(i >= 5) {
                break;
            }
        }

        preview.removeClass('hidden');
    },

    /**
     * Hide the preview
     */
    hidePreview: function() {
        $('#preview').addClass('hidden');
    }
});