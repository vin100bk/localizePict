/**
 * Tests suite for Picture model
 */
describe('Picture model', function () {

    describe('.constructor()', function () {

        describe('With minimum data', function () {

            beforeEach(function () {
                spyOn(Picture.__super__, 'constructor').and.callThrough();
                spyOn(Picture.prototype, 'parse').and.returnValue({
                    id: '1',
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });
                spyOn(Picture.prototype, 'set');

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

            it('Should call the parent .constructor() with the parse option', function () {
                expect(Picture.__super__.constructor).toHaveBeenCalledWith({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }, jasmine.objectContaining({parse: true}));
            });

            it('Should call parse()', function () {
                expect(Picture.prototype.parse).toHaveBeenCalledWith({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }, jasmine.any(Object));
            });

            it('Should call set()', function () {
                expect(Picture.prototype.set).toHaveBeenCalledWith({
                    id: '1',
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }, jasmine.any(Object));
            });
        });

        describe('Without minimum data', function () {

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

            it('Should return an error with an empty location', function () {
                expect(function () {
                    new Picture({
                        pid: '1',
                        icon: 'http://myicon.jpg',
                        picture: 'http://myoriginal.jpg',
                        location: {}
                    });
                }).toThrow(jasmine.any(Object));
            });

            it('Should return an error with a location without latitude', function () {
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

            it('Should return an error with a location without longitude', function () {
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
    });

    describe('.set()', function() {
        beforeEach(function () {
            spyOn(Picture.__super__, 'set').and.callThrough();
            spyOn(Picture.prototype, 'validate');

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

        it('Should call the parent .set() with the validate option', function () {
            expect(Picture.__super__.set).toHaveBeenCalledWith(jasmine.objectContaining({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            }), jasmine.objectContaining({validate: true}));
        });

        it('Should call validate()', function () {
            expect(Picture.prototype.validate).toHaveBeenCalledWith(jasmine.objectContaining({
                id: '1',
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            }), jasmine.any(Object));
        });
    });

    describe('.parse()', function () {

        it('Should generate an ID with the provider prefix (provider is in data)', function() {
            var provider = new FacebookProvider();
            var pictureData = {
                pid: '1',
                provider: provider,
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            };
            var picture = new Picture(pictureData);

            expect(picture.parse(pictureData)).toEqual({
                id: provider.get('prefix') + '1',
                pid: '1',
                provider: provider,
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            });
        });

        it('Should generate an ID which is equals to the picture ID (provider is not in data)', function() {
            var pictureData = {
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            };
            var picture = new Picture(pictureData);

            expect(picture.parse(pictureData)).toEqual({
                id: '1',
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            });
        });
    });

    describe('.validate()', function() {

    });
});
