/**
 * The application
 */
var LocalizePict = Backbone.View.extend({
    /** Root element */
    el: $('body'),

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
        this.initMap();
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
        return this;
    },

    /**
     * Update the application
     */
    update: function() {
        this.populateMap();
        this.renderSideBar();
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

            // On mouseover
            google.maps.event.addListener(marker, 'mouseover', function () {
                console.log(picture);
                pictInfos = new google.maps.InfoWindow({
                    content: '<div><img src="' + picture.icon + '" alt="" /></div>'
                });
                pictInfos.open(this.map, marker);
            });

            // On mouseout
            google.maps.event.addListener(marker, 'mouseout', function (event) {
                pictInfos.close();
            });
        });
    },

    /**
     * Render the sidebar
     */
    renderSideBar: function () {
        var self = this;
        this.model.each(function (picture) {

        });
    },

    /**
     * Callback when a user want to add Facebook pictures
     */
    addFbPictures: function (e) {
        e.preventDefault();
        // @todo: Handle errors
        this.model.addFromFb();
    },
});