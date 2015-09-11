/**
 * Main view
 */
LocalizePict.View.App = LocalizePict.View.Abstract.extend({
    /** Root element */
    el: '#map',

    /** The Google Map object */
    map: null,

    /** Events */
    events: {
    },

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
     */
    update: function () {
        this.populateMap();
    },

    /**
     * Populate the map with picture markers
     */
    populateMap: function () {
        /**
         * Show markers
         */
        var self = this;
        this.model.each(function (picture) {
            // Create the market with the longitude and latitude of the current picture
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(picture.attributes.location.latitude, picture.attributes.location.longitude),
                map: self.map,
            });

            // On click
            google.maps.event.addListener(marker, 'click', function () {
                console.log('click');
            });
        });
    }
});