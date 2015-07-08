/**
 * The application
 */
var LocalizePict = Backbone.View.extend({
    /** Root element */
    el: $('body'),

    /** Events */
    events: {
        'click a#addPictFb': 'addFbPictures',
    },

    /**
     * Initialize the application
     */
    initialize: function () {
        this.model = new Pictures();
        this.listenTo(this.model, 'reset', this.render);
        this.initMap();
        this.render();
    },

    /**
     * Render the application
     */
    render: function () {
        this.populateMap();
        this.renderSideBar();
    },

    /**
     * Init the map
     */
    initMap: function () {
        var mapOptions = {
            center: {lat: -34.397, lng: 150.644},
            zoom: 2
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
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
        $('#sidebar').append('<a href="#" id="addPictFb">+ Fb</a>');
    },

    /**
     * Callback when a user want to add Facebook pictures
     */
    addFbPictures: function (e) {
        e.preventDefault();
        this.model.addFromFb();
    },
});