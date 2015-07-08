/**
 * Tests suite for Picture model
 */
describe('Picture model', function () {

    beforeEach(function () {
        this.picture = new Picture({
            provider: {},
            album: 'My first album',
            icon: 'http://myicon.jpg',
            pictures: [{
                width: 10,
                height: 10,
                source: 'http://10x10.jpg'
            }, {
                width: 50,
                height: 100,
                source: 'http://50x100.jpg'
            }, {
                width: 100,
                height: 50,
                source: 'http://100x50.jpg'
            }],
            location: {
                latitude: '40.713509',
                longitude: '-73.941141',
                label: 'Home',
                city: 'Brooklyn',
                country: 'USA'
            },
            label: 'Home sweet home',
            link: 'http://mylink.com',
            date: '1436143423'
        });
    });

    describe('get()', function() {
        it('album. Should return the album name', function () {
            expect(this.picture.get('album')).toEqual('My first album');
        });

        it('icon. Should return the icon URL', function () {
            expect(this.picture.get('icon')).toEqual('http://myicon.jpg');
        });

        it('pictures. Should return the pictures', function () {
            expect(this.picture.get('pictures').length).toEqual(3);
            expect(this.picture.get('pictures')).toEqual([{
                width: 10,
                height: 10,
                source: 'http://10x10.jpg'
            }, {
                width: 50,
                height: 100,
                source: 'http://50x100.jpg'
            }, {
                width: 100,
                height: 50,
                source: 'http://100x50.jpg'
            }]);
        });

        it('label. Should return the label', function () {
            expect(this.picture.get('label')).toEqual('Home sweet home');
        });

        it('link. Should return the link', function () {
            expect(this.picture.get('link')).toEqual('http://mylink.com');
        });

        it('date. Should return the date', function () {
            expect(this.picture.get('date')).toEqual('1436143423');
        });

        describe('location. ', function() {
            beforeEach(function () {
                this.location = this.picture.get('location');
            });

            it('latitude. Should return the latitude', function () {
                expect(this.location.latitude).toEqual('40.713509');
            });

            it('longitude. Should return the longitude', function () {
                expect(this.location.longitude).toEqual('-73.941141');
            });

            it('label. Should return the label', function () {
                expect(this.location.label).toEqual('Home');
            });

            it('city. Should return the city', function () {
                expect(this.location.city).toEqual('Brooklyn');
            });

            it('country. Should return the country', function () {
                expect(this.location.country).toEqual('USA');
            });
        });

        it('album, icon, label, link, date, location. Should return null when there is no data available', function() {
            var picture = new Picture();

            expect(picture.get('album')).toBe(null);
            expect(picture.get('icon')).toBe(null);
            expect(picture.get('label')).toBe(null);
            expect(picture.get('link')).toBe(null);
            expect(picture.get('date')).toBe(null);
            expect(picture.get('location')).toBe(null);
        });

        it('pictures. Should return an empty array when there is no data available', function() {
            var picture = new Picture();

            expect(picture.get('pictures')).toEqual([]);
        });
    });

    describe('getBiggest()', function() {
        it('Should return the biggest picture available', function() {
            expect(this.picture.getBiggest()).toEqual({
                width: 100,
                height: 50,
                source: 'http://100x50.jpg'
            });
        });

        it('Should return the only one picture available', function() {
            var onePicture = new Picture({
                pictures: [{
                    width: 10,
                    height: 10,
                    source: 'http://10x10.jpg'
                }]
            });
            expect(onePicture.getBiggest()).toEqual({
                width: 10,
                height: 10,
                source: 'http://10x10.jpg'
            });
        });

        it('Should return null when there is no picture available', function() {
            var onePicture = new Picture();
            expect(onePicture.getBiggest()).toBe(null);
        });
    });
});
