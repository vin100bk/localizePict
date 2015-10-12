/**
 * Tests suite for App
 */
describe('LocalizePict.View.App', function () {

    describe('.update()', function () {

        beforeEach(function () {
            var pictures = [
                new LocalizePict.Model.Picture({
                    pid: '1',
                    icon: 'http://myicon1.jpg',
                    picture: 'http://myoriginal1.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }),
                new LocalizePict.Model.Picture({
                    pid: '2',
                    icon: 'http://myicon2.jpg',
                    picture: 'http://myoriginal2.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }),
                new LocalizePict.Model.Picture({
                    pid: '2',
                    icon: 'http://myicon2.jpg',
                    picture: 'http://myoriginal2.jpg',
                    location: {
                        latitude: '41.713509',
                        longitude: '-73.941141',
                    }
                }),
                new LocalizePict.Model.Picture({
                    pid: '2',
                    icon: 'http://myicon2.jpg',
                    picture: 'http://myoriginal2.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941142',
                    }
                }),
                new LocalizePict.Model.Picture({
                    pid: '2',
                    icon: 'http://myicon2.jpg',
                    picture: 'http://myoriginal2.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941142',
                    }
                })];

            /**
             * Spies
             */
            spyOn(google.maps, 'Marker').and.returnValue({setTitle: function() {}});
            spyOn(google.maps.event, 'addListener').and.callThrough();

            var app = new LocalizePict.View.App();
            // Clean old recorded coordinates
            app.coordinates = {};
            app.update(pictures);
        });

        it('Should create a new marker only for pictures with a different location', function() {
            expect(google.maps.Marker.calls.count()).toEqual(3);
        });

        it('Should attach events on each marker', function() {
            expect(google.maps.event.addListener.calls.count()).toEqual(6);
        });
    });
});
