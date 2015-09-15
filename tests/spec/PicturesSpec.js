/**
 * Tests suite for Pictures collection
 */
describe('Pictures', function () {

    beforeEach(function () {
        spyOn(LocalizePict.View.App.prototype, 'update').and.callThrough();
        this.app = new LocalizePict.View.App();
        this.pictures = this.app.model;
    });

    it('An intiale collection should be empty', function () {
        expect(this.pictures.length).toEqual(0);
    });

    describe('.set()', function() {

        beforeEach(function () {
            this.picturesData = [
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
                })];
        });

        it('Should set new pictures in the collection', function() {
            expect(this.pictures.length).toEqual(0);
            this.pictures.set(this.picturesData);
            expect(this.pictures.length).toEqual(2);
        });

        it('Should trigger an event "set"', function() {
            spyOn(this.pictures, 'trigger');
            this.pictures.set(this.picturesData);
            expect(this.pictures.trigger).toHaveBeenCalledWith('set');
        });
    });

    describe('.addFromFb()', function () {

        beforeAll(function () {
            // Load data examples
            this.data = loadJSONFixtures('fbPicturesExample.json', 'fbPicturesNoPictures.json');
        });

        beforeEach(function () {
            var promise = jasmine.createSpyObj('promise', ['done']);
            this.deferred = jasmine.createSpyObj('deferred', ['notify', 'resolve', 'reject', 'promise']);
            // Create a psy for the SDK loading
            spyOn($, 'getScript').and.returnValue(promise);
            // Create a spy for set()
            spyOn(this.pictures, 'set').and.callThrough();
            // Create a spy for the Deferred
            spyOn($, 'Deferred').and.returnValue(this.deferred);
            // Execute the function
            this.pictures.addFromFb();
            // Create a mock for the FB object
            FB = jasmine.createSpyObj('FB', [
                'init',
                'getLoginStatus',
                'api',
                'login'
            ]);

            // Process the callback of getScript
            var getScriptCallback = promise.done.calls.argsFor(0)[0];
            getScriptCallback();
        });

        it('Should call the Facebook SDK once', function () {
            expect($.getScript).toHaveBeenCalledWith('//connect.facebook.net/en_US/sdk.js');
            expect($.getScript.calls.count()).toEqual(1);
        });

        it('Should call FB.init()', function () {
            // Init
            expect(FB.init).toHaveBeenCalledWith({
                appId: jasmine.any(String),
                version: jasmine.any(String)
            });
        });

        describe('When not connected', function () {

            it('Should call FB.login()', function () {
                // Create a mock response object
                var response = jasmine.createSpy('response');
                response.status = 'annymous';

                // Process the callback of FB.getScript()
                var getLoginStatusCallback = FB.getLoginStatus.calls.argsFor(0)[0];
                getLoginStatusCallback(response);

                expect(FB.login).toHaveBeenCalledWith({scope: 'user_photos'});
            });

            it('Should throw an error with a no compliant response', function () {
                // Create a mock response object
                var response = jasmine.createSpy('response');

                // Process the callback of FB.getScript()
                var getLoginStatusCallback = FB.getLoginStatus.calls.argsFor(0)[0];

                expect(getLoginStatusCallback.bind(null, response)).toThrow();
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

                this.apiCallback = FB.api.calls.argsFor(0)[3];
            });


            it('Should call FB.getLoginStatus()', function () {
                // getLoginStatus
                expect(FB.getLoginStatus).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it('Should call FB.api()', function () {
                // api
                expect(FB.api).toHaveBeenCalledWith('/me/photos', 'get', jasmine.any(Object), jasmine.any(Function));
            });

            describe('With a standart JSON', function () {

                describe('With localized pictures', function () {
                    beforeEach(function () {
                        // Process the callback of FB.api()
                        this.apiCallback(this.data['fbPicturesExample.json']);
                    });

                    it('Should call set()', function () {
                        expect(this.pictures.set).toHaveBeenCalledWith(jasmine.any(Array));
                        // Get the array built from json data
                        var array = this.pictures.set.calls.argsFor(0)[0];
                        expect(array.length).toEqual(4);
                        expect(array[0]).toEqual(jasmine.any(LocalizePict.Model.Picture));
                    });

                    it('Should notify the success', function() {
                        expect(this.deferred.resolve).toHaveBeenCalled();
                    });

                    it('Should notify the view about the change', function() {
                        expect(LocalizePict.View.App.prototype.update).toHaveBeenCalled();
                    });

                    it('Should assign an array of Picture', function () {
                        var picturesArray = this.pictures.models;
                        expect(picturesArray.length).toEqual(4);
                        expect(picturesArray[0]).toEqual(jasmine.any(LocalizePict.Model.Picture));
                    });

                    it('Should retrieve the correct picture', function () {
                        var prefix = new LocalizePict.Model.FacebookProvider().get('prefix');
                        expect(this.pictures.get(prefix + '5').get('label')).toEqual('My fake picture number 5');
                    });

                    it('Should not retrieve a picture without localized information', function() {
                        var prefix = new LocalizePict.Model.FacebookProvider().get('prefix');
                        expect(this.pictures.get(prefix + '1')).toBeUndefined();
                    });
                });

                describe('Without localized pictures', function () {
                    beforeEach(function () {
                        // Process the callback of FB.api()
                        this.apiCallback(this.data['fbPicturesNoPictures.json']);
                    });

                    it('Should not call set()', function () {
                        expect(this.pictures.set).not.toHaveBeenCalled();
                    });

                    it('Should not notify the view about the change', function() {
                        expect(LocalizePict.View.App.prototype.update).not.toHaveBeenCalled();
                    });
                });
            });

            describe('With a non standart JSON (empty or corrupted JSON)', function () {
                it('Should throw an error with an empty string as JSON', function () {
                    expect(this.apiCallback.bind(null, '')).toThrow();
                    expect(this.pictures.set).not.toHaveBeenCalled();
                });

                it('Should throw an error with a corrupted JSON', function () {
                    expect(this.apiCallback.bind(null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae rutrum est. Pellentesque ut ligula nec justo porta pretium. Aliquam.')).toThrow();
                    expect(this.pictures.set).not.toHaveBeenCalled();
                });

                it('Should not notify the view about a change', function() {
                    expect(this.apiCallback.bind(null, '')).toThrow();
                    expect(LocalizePict.View.App.prototype.update).not.toHaveBeenCalled();
                });
            });
        });
    });
});