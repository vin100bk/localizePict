/**
 * Tests suite for Picture model
 */
describe('Picture', function () {

    beforeEach(function () {
        this.picture = new Picture({
            provider: {},
            album: 'My first album',
            icon: 'http://myicon.jpg',
            picture: 'http://myoriginal.jpg',
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

        this.pictureEmpty = new Picture();
    });

    describe('.get()', function() {
        describe('Without data', function() {
            it('"album", "icon", "picture", "label", "link", "date", "location". Should return null', function() {
                expect(this.pictureEmpty.get('album')).toBe(null);
                expect(this.pictureEmpty.get('icon')).toBe(null);
                expect(this.pictureEmpty.get('picture')).toBe(null);
                expect(this.pictureEmpty.get('label')).toBe(null);
                expect(this.pictureEmpty.get('link')).toBe(null);
                expect(this.pictureEmpty.get('date')).toBe(null);
                expect(this.pictureEmpty.get('location')).toBe(null);
            });
        });

        describe('With data', function() {
            it('"album". Should return the album name', function () {
                expect(this.picture.get('album')).toEqual('My first album');
            });

            it('"icon". Should return the icon URL', function () {
                expect(this.picture.get('icon')).toEqual('http://myicon.jpg');
            });

            it('"picture". Should return the picture URL', function () {
                expect(this.picture.get('picture')).toEqual('http://myoriginal.jpg');
            });

            it('"label". Should return the label', function () {
                expect(this.picture.get('label')).toEqual('Home sweet home');
            });

            it('"link". Should return the link', function () {
                expect(this.picture.get('link')).toEqual('http://mylink.com');
            });

            it('"date". Should return the date', function () {
                expect(this.picture.get('date')).toEqual('1436143423');
            });

            describe('"location"', function() {
                beforeEach(function () {
                    this.location = this.picture.get('location');
                });

                it('.latitude. Should return the latitude', function () {
                    expect(this.location.latitude).toEqual('40.713509');
                });

                it('.longitude. Should return the longitude', function () {
                    expect(this.location.longitude).toEqual('-73.941141');
                });

                it('.label. Should return the label', function () {
                    expect(this.location.label).toEqual('Home');
                });

                it('.city. Should return the city', function () {
                    expect(this.location.city).toEqual('Brooklyn');
                });

                it('.country. Should return the country', function () {
                    expect(this.location.country).toEqual('USA');
                });
            });
        });
    });
});
