/**
 * Tests suite for PicturesFb collection
 */
describe('Pictures::Facebook', function () {

    beforeEach(function () {
        spyOn(LocalizePict.View.App.prototype, 'update').and.callThrough();
        this.app = new LocalizePict.View.App();
        this.pictures = this.app.model;

        // Sample of pictures
        this.picts = [
            new LocalizePict.Model.Picture({
                pid: '1',
                icon: 'http://myicon.jpg',
                picture: 'http://myoriginal.jpg',
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
            })
        ];
    });

    describe('.addFromFb()', function () {

        beforeAll(function () {
            // Load data examples
            this.data = loadJSONFixtures('fbPicturesExample.json', 'fbPicturesNoPictures.json');
        });

        beforeEach(function () {
            /**
             * Mocks of Deferred
             */
            var promiseGetScript = $.Deferred().promise();
            this.overallDeferred = $.Deferred();
            this.deferredTagged = $.Deferred();
            this.deferredUploaded = $.Deferred();

            /**
             * Spies
             */
            spyOn(promiseGetScript, 'done').and.callThrough();
            spyOn($, 'getScript').and.returnValue(promiseGetScript);
            spyOn(this.pictures, 'set').and.callThrough();
            spyOn(this.pictures, 'getPicturesFromFb').and.returnValues(this.deferredTagged, this.deferredUploaded);
            spyOn(this.overallDeferred, 'resolve').and.returnValue(this.overallDeferred);
            spyOn($, 'Deferred').and.returnValue(this.overallDeferred);

            /**
             * Execute the function
             */
            this.pictures.addFromFb();

            /**
             * Process the callback of getScript
             */

            // Create a mock for the FB object
            FB = jasmine.createSpyObj('FB', [
                'init',
                'getLoginStatus',
                'login'
            ]);

            var getScriptCallback = promiseGetScript.done.calls.argsFor(0)[0];
            getScriptCallback();
        });

        it('Should call the Facebook SDK once', function () {
            expect($.getScript).toHaveBeenCalledWith('//connect.facebook.net/en_US/sdk.js');
            expect($.getScript.calls.count()).toEqual(1);
        });

        it('Should throw an error with a no compliant response', function () {
            // Create a mock response object
            var response = jasmine.createSpy('response');

            // Process the callback of FB.getScript()
            var getLoginStatusCallback = FB.getLoginStatus.calls.argsFor(0)[0];

            expect(getLoginStatusCallback.bind(null, response)).toThrow();
        });

        describe('When connected', function() {
            it('Should call FB.login()', function () {
                // Create a mock response object
                var response = jasmine.createSpy('response');
                response.status = 'annymous';

                // Process the callback of FB.getScript()
                var getLoginStatusCallback = FB.getLoginStatus.calls.argsFor(0)[0];
                getLoginStatusCallback(response);

                expect(FB.login).toHaveBeenCalled();
            });
        });

        describe('When connected', function () {

            beforeEach(function () {
                // Create a mock response object
                var response = jasmine.createSpy('response');
                response.status = 'connected';

                // Process the callback of FB.getScript()
                var getLoginStatusCallback = FB.getLoginStatus.calls.argsFor(0)[0];
                getLoginStatusCallback(response);
            });

            describe('Tagged pictures', function () {

                it('Should call .getPicturesFromFb()', function () {
                    expect(this.pictures.getPicturesFromFb).toHaveBeenCalledWith('/me/photos/');
                });

                it('Should not set pictures when .getPicturesFromFb() is not resolved', function () {
                    expect(this.pictures.set).not.toHaveBeenCalled();
                });

                it('Should not set pictures when .getPicturesFromFb() is resolved with an empty array of pictures', function () {
                    this.deferredTagged.resolve([]);
                    expect(this.pictures.set).not.toHaveBeenCalled();
                });

                it('Should set pictures when .getPicturesFromFb() is resolved', function () {
                    this.deferredTagged.resolve(this.picts);
                    expect(this.pictures.set).toHaveBeenCalledWith(this.picts);
                });
            });

            describe('Uploaded pictures', function () {

                it('Should call .getPicturesFromFb()', function () {
                    expect(this.pictures.getPicturesFromFb).toHaveBeenCalledWith('/me/photos/?type=uploaded');
                });

                it('Should not set pictures when .getPicturesFromFb() is not resolved', function () {
                    expect(this.pictures.set).not.toHaveBeenCalled();
                });

                it('Should not set pictures when .getPicturesFromFb() is resolved with an empty array of pictures', function () {
                    this.deferredUploaded.resolve([]);
                    expect(this.pictures.set).not.toHaveBeenCalled();
                });

                it('Should set pictures when .getPicturesFromFb() is resolved', function () {
                    this.deferredUploaded.resolve(this.picts);
                    expect(this.pictures.set).toHaveBeenCalledWith(this.picts);
                });
            });

            it('Should resolve the process when tagged pictures and uploaded pictures are resolved', function () {
                expect(this.overallDeferred.resolve).not.toHaveBeenCalled();
                this.deferredTagged.resolve(this.picts);
                expect(this.overallDeferred.resolve).not.toHaveBeenCalled();
                this.deferredUploaded.resolve(this.picts);
                expect(this.overallDeferred.resolve).toHaveBeenCalled();
            });
        });
    });

    describe('.getPicturesFromFb()', function () {
        beforeAll(function () {
            // Load data examples
            this.data = loadJSONFixtures('fbPicturesExample.json', 'fbPicturesNoPictures.json', 'fbPicturesExampleWithPages.json');
        });

        beforeEach(function () {
            /**
             * Mocks
             */
            this.deferred = $.Deferred();
            this.nestedDeferred = $.Deferred();

            /**
             * Spies
             */
            spyOn(this.deferred, 'resolve');
            spyOn($, 'Deferred').and.returnValues(this.deferred, this.nestedDeferred, this.nestedDeferred);
            FB = jasmine.createSpyObj('FB', [
                'api'
            ]);
            spyOn(this.pictures, 'getPicturesFromFb').and.callThrough();

            /**
             * Execute the function
             */
            this.pictures.getPicturesFromFb('http://mytest');

            // Get the callback function of FB.api
            this.apiCallback = FB.api.calls.argsFor(0)[3];
        });

        it('Should call FB.api', function () {
            expect(FB.api).toHaveBeenCalledWith('http://mytest', 'get', jasmine.any(Object), jasmine.any(Function));
        });

        describe('With one page', function () {
            describe('With a standard JSON', function () {

                describe('With localized pictures', function () {
                    beforeEach(function () {
                        this.apiCallback(this.data['fbPicturesExample.json']);
                    });

                    it('Should resolve the process with only geo tagged pictures', function () {
                        expect(this.deferred.resolve).toHaveBeenCalledWith(jasmine.any(Array));
                        // Get the array built from json data
                        var array = this.deferred.resolve.calls.argsFor(0)[0];
                        expect(array.length).toEqual(4);
                        expect(array[0]).toEqual(jasmine.any(LocalizePict.Model.Picture));
                    });
                });

                describe('Without localized pictures', function () {
                    beforeEach(function () {
                        // Process the callback of FB.api()
                        this.apiCallback(this.data['fbPicturesNoPictures.json']);
                    });

                    it('Should resolve the process with no pictures', function () {
                        expect(this.deferred.resolve).toHaveBeenCalledWith([]);
                    });
                });
            });

            describe('With a non standard JSON (empty or corrupted JSON)', function () {
                it('Should throw an error with an empty string as JSON', function () {
                    expect(this.apiCallback.bind(null, '')).toThrow();
                    expect(this.deferred.resolve).not.toHaveBeenCalled();
                });

                it('Should throw an error with a corrupted JSON', function () {
                    expect(this.apiCallback.bind(null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae rutrum est. Pellentesque ut ligula nec justo porta pretium. Aliquam.')).toThrow();
                    expect(this.deferred.resolve).not.toHaveBeenCalled();
                });
            });
        });

        describe('With multiples pages (and standard JSON)', function () {
            beforeEach(function () {
                this.apiCallback(this.data['fbPicturesExampleWithPages.json']);
            });

            it('Should call .getPicturesFromFb() recursively', function () {
                expect(this.pictures.getPicturesFromFb).toHaveBeenCalledWith('https://gotomysecondpage');
                expect(this.pictures.getPicturesFromFb.calls.count()).toEqual(2);
            });
        });
    });
});