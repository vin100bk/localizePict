/**
 * The application
 */
var LocalizePict = Backbone.View.extend({
    /** Root element */
    el: $('#global'),

    /** Events */
    events: {
        'click a#add-pict-fb': 'addFbPictures',
    },

    /**
     * Initialize the application
     */
    initialize: function () {
        this.model = new Pictures();
        this.model.on('set', this.update, this);
        this.render();
    },

    /**
     * Init the map
     */
    initMap: function () {
        var mapOptions = {
            center: {lat: -34.397, lng: 150.644},
            zoom: 2
        };

        var map = document.getElementById('map');
        if(map) {
            this.map = new google.maps.Map(map, mapOptions);
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
    update: function() {
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
        var pictInfos;
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
    },

    /**
     * Show provider options
     * @param element: the element clicked
     */
    showOptionsProvider: function(element) {
        var after = element.next();
        if(after.hasClass('providerOpts')) {
            // Options already inserted
            after.toggle();
        } else {
            element.after(this.template('tplProviderOpts'));
        }
    },

    /**
     * Render a template from its HTML ID
     * @param id: HTML ID
     * @returns the template string
     */
    template: function(id) {
        return $('#' + id).html();
    },

    /**
     * Callback when a user want to add Facebook pictures
     */
    addFbPictures: function (e) {
        e.preventDefault();
        // @todo: Handle errors

        // Clicked element
        var element = $(e.currentTarget);

        if(element.hasClass('active')) {
            // Pictures already added
            this.showOptionsProvider(element);
        } else {
            this.model.addFromFb();
            element.addClass('active');
        }
    },
});