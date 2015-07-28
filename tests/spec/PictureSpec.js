/**
 * Tests suite for Picture model
 */
describe('Picture model', function () {

    describe('.initialize()', function () {

        it('Should return an error without pid', function () {
            expect(function () {
                new Picture({
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });
            }).toThrow(jasmine.any(Object));
        });

        it('Should return an error without icon', function () {
            expect(function () {
                new Picture({
                    pid: '1',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });
            }).toThrow(jasmine.any(Object));
        });

        it('Should return an error without picture', function () {
            expect(function () {
                new Picture({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });
            }).toThrow(jasmine.any(Object));
        });

        it('Should return an error without location', function () {
            expect(function () {
                new Picture({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg'
                });
            }).toThrow(jasmine.any(Object));
        });

        it('Should return an error with an empty location', function() {
            expect(function () {
                new Picture({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                    }
                });
            }).toThrow(jasmine.any(Object));
        });

        it('Should return an error with a location without latitude', function() {
            expect(function () {
                new Picture({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        longitude: '-73.941141'
                    }
                });
            }).toThrow(jasmine.any(Object));
        });

        it('Should return an error with a location without longitude', function() {
            expect(function () {
                new Picture({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                    }
                });
            }).toThrow(jasmine.any(Object));
        });
    });

    describe('.get()', function () {
        describe('With maximum data', function () {
            beforeEach(function () {
                this.picture = new Picture({
                    pid: '1',
                    provider: new FacebookProvider(),
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
            });

            it('"pid". Should return the picture ID', function () {
                expect(this.picture.get('pid')).toEqual('1');
            });

            it('"id". Should return the ID: the concatenation between the pid and the prefix of the provider', function () {
                expect(this.picture.get('id')).toEqual(this.picture.get('provider').get('prefix') + '1');
            });

            it('"provider". Should return an instance of Provider', function () {
                expect(this.picture.get('provider')).toEqual(jasmine.any(Provider));
            });

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

            describe('"location"', function () {
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

        describe('With minimum data', function () {
            beforeEach(function () {
                this.picture = new Picture({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });
            });

            it('"pid". Should be undefined', function () {
                expect(this.picture.get('pid')).toEqual('1');
            });

            it('"id". Should return the ID: just the picture ID (we don\'t have provider)', function () {
                expect(this.picture.get('id')).toEqual('1');
            });

            it('"provider". Should be undefined', function () {
                expect(this.picture.get('provider')).toBeUndefined();
            });

            it('"album". Should be undefined', function () {
                expect(this.picture.get('album')).toBeUndefined();
            });

            it('"icon". Should return the icon URL', function () {
                expect(this.picture.get('icon')).toEqual('http://myicon.jpg');
            });

            it('"picture". Should return the picture URL', function () {
                expect(this.picture.get('picture')).toEqual('http://myoriginal.jpg');
            });

            it('"label". Should be undefined', function () {
                expect(this.picture.get('label')).toBeUndefined();
            });

            it('"link". Should return the link', function () {
                expect(this.picture.get('link')).toBeUndefined();
            });

            it('"date". Should return the date', function () {
                expect(this.picture.get('date')).toBeUndefined();
            });

            describe('"location"', function () {
                beforeEach(function () {
                    this.location = this.picture.get('location');
                });

                it('.latitude. Should return the latitude', function () {
                    expect(this.location.latitude).toEqual('40.713509');
                });

                it('.longitude. Should return the longitude', function () {
                    expect(this.location.longitude).toEqual('-73.941141');
                });

                it('.label. Should be undefined', function () {
                    expect(this.location.label).toBeUndefined();
                });

                it('.city. Should be undefined', function () {
                    expect(this.location.city).toBeUndefined();
                });

                it('.country. Should be undefined', function () {
                    expect(this.location.country).toBeUndefined();
                });
            });
        });
    });
});
