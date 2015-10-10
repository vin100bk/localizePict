/**
 * Tests suite for Picture model
 */
describe('Picture', function () {

    describe('.constructor()', function () {

        describe('With correct data', function () {

            beforeEach(function () {
                spyOn(LocalizePict.Model.Picture.prototype, 'parse').and.returnValue({
                    id: '1',
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });
                spyOn(LocalizePict.Model.Picture.prototype, 'validate');

                this.picture = new LocalizePict.Model.Picture({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });
            });

            it('Should call parse()', function () {
                expect(LocalizePict.Model.Picture.prototype.parse).toHaveBeenCalledWith({
                    pid: '1',
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }, jasmine.any(Object));
            });

            it('Should call validate()', function () {
                expect(LocalizePict.Model.Picture.prototype.validate).toHaveBeenCalled();
            });
        });

        describe('With incorrect data', function () {

            it('Should trigger an error', function () {
                var pict = new LocalizePict.Model.Picture({
                    icon: 'http://myicon.jpg',
                    picture: 'http://myoriginal.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                });

                var spy = jasmine.createSpy('event');
                pict.on('invalid', spy);
                pict.isValid();
                expect(spy).toHaveBeenCalled();
            });

            /*
             * To see more examples of incorrect data, go to validate() tests
             */
        });
    });

    describe('.set()', function() {
        beforeEach(function () {
            spyOn(LocalizePict.Model.Picture.prototype, 'validate');

            this.picture = new LocalizePict.Model.Picture({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            });
        });

        it('Should call validate()', function () {
            expect(LocalizePict.Model.Picture.prototype.validate).toHaveBeenCalledWith(jasmine.objectContaining({
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
            var provider = new LocalizePict.Model.FacebookProvider();
            expect(LocalizePict.Model.Picture.prototype.parse({
                pid: '1',
                provider: provider,
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            })).toEqual({
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
            expect(LocalizePict.Model.Picture.prototype.parse({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            })).toEqual({
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
        it('Should trigger an error without pid', function () {
            expect(LocalizePict.Model.Picture.prototype.validate({
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            })).toEqual({
                name: 'PictureException',
                message: 'A picture has to have a pid'
            });
        });

        it('Should trigger an error without icon', function () {
            expect(LocalizePict.Model.Picture.prototype.validate({
                pid: '1',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            })).toEqual({
                name: 'PictureException',
                message: 'A picture has to have an icon'
            });
        });

        it('Should trigger an error without picture', function () {
            expect(LocalizePict.Model.Picture.prototype.validate({
                pid: '1',
                icon: 'http://myicon.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            })).toEqual({
                name: 'PictureException',
                message: 'A picture has to have a picture field'
            });
        });

        it('Should trigger an error without location', function () {
            expect(LocalizePict.Model.Picture.prototype.validate({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg'
            })).toEqual({
                name: 'PictureException',
                message: 'A picture has to have a location'
            });
        });

        it('Should trigger an error with an empty location', function () {
            expect(LocalizePict.Model.Picture.prototype.validate({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {}
            })).toEqual({
                name: 'PictureException',
                message: 'The location is not valid'
            });
        });

        it('Should trigger an error with a location without latitude', function () {
            expect(LocalizePict.Model.Picture.prototype.validate({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    longitude: '-73.941141'
                }
            })).toEqual({
                name: 'PictureException',
                message: 'The location is not valid'
            });
        });

        it('Should trigger an error with a location without longitude', function () {
            expect(LocalizePict.Model.Picture.prototype.validate({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
                location: {
                    latitude: '40.713509',
                }
            })).toEqual({
                name: 'PictureException',
                message: 'The location is not valid'
            });
        });
    });
});
