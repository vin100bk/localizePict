/**
 * Represent a picture
 */
var Picture = Backbone.Model.extend({});

/**
 * Represent a collection of pictures
 */
var Pictures = Backbone.Collection.extend({
    /** Associated model */
    model: Picture,

    /**
     * Add pictures from Facebook to the collection
     */
    addFromFb: function () {
        var self = this;
        $.ajaxSetup({cache: true});
        $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
            // Connexion
            FB.init({
                appId: '904308072941010',
                version: 'v2.3'
            });

            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.api('/me/photos', 'get', {
                        limit: 500,
                        date_format: 'U'
                        //fields: 'place,album,picture,images,place,name,link,created_time'
                    }, function (data) {
                        // Contains all pictures
                        var pictures = [];

                        // Browse all pictures
                        _.each(data.data, function (element, index, list) {
                            if (_.has(element, 'place')) {
                                // The picture has a place. Other pictures are not interesting for us
                                pictures.push(new Picture({
                                    provider: {},
                                    album: element.album,
                                    icon: element.picture,
                                    pictures: element.images,
                                    location: {
                                        latitude: element.place.location.latitude,
                                        longitude: element.place.location.longitude,
                                        label: element.place.name,
                                        city: element.place.location.city,
                                        country: element.place.location.country
                                    },
                                    label: element.name,
                                    link: element.link,
                                    date: element.created_time
                                }));
                            }
                        });

                        // Reset the collection with the new photos list (@todo: handle several providers)
                        self.reset(pictures);
                    });
                } else {
                    FB.login({scope: 'user_photos'});
                }
            });
        });

    },
});

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