/**
 * Tests suite for Pictures collection
 */
describe('Pictures', function () {

    beforeEach(function () {
        this.app = new LocalizePict();
        this.pictures = this.app.model;
    });

    it('An intiale collection should be empty', function () {
        expect(this.pictures.length).toEqual(0);
    });

    describe('.addFromFb()', function () {

        beforeAll(function () {
            // Load data examples
            this.data = loadJSONFixtures('fbPicturesExample.json', 'fbPicturesNoPictures.json', 'fbPicturesNoData.json');
        });

        beforeEach(function () {
            // Create a psy for the SDK loading
            spyOn($, 'getScript');
            // Create a spy for reset()
            spyOn(this.pictures, 'reset');
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
            var getScriptCallback = $.getScript.calls.argsFor(0)[1];
            getScriptCallback();
        });

        describe('When no connected', function () {

            it('Should call FB.login()', function () {
                // Create a mock response object
                var response = jasmine.createSpy('response');
                response.status = 'annymous';

                // Process the callback of FB.getScript()
                var getLoginStatusCallback = FB.getLoginStatus.calls.argsFor(0)[0];
                getLoginStatusCallback(response);

                expect(FB.login).toHaveBeenCalledWith({scope: 'user_photos'});
            });

            it('Should throw an error with a non conforme response', function () {
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

            it('Should call the Facebook SDK once', function () {
                expect($.getScript).toHaveBeenCalledWith('//connect.facebook.net/en_US/sdk.js', jasmine.any(Function));
                expect($.getScript.calls.count()).toEqual(1);
            });

            it('Should call FB.init()', function () {
                // Init
                expect(FB.init).toHaveBeenCalledWith({
                    appId: jasmine.any(String),
                    version: jasmine.any(String)
                });
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

                    it('Should call reset()', function () {
                        expect(this.pictures.reset).toHaveBeenCalledWith(jasmine.any(Array));
                        // Get the array built from json data
                        var array = this.pictures.reset.calls.argsFor(0)[0];
                        expect(array.length).toEqual(4);
                    });
                });

                it('Without localized pictures, should call reset() with an empty array as parameter', function () {
                    this.apiCallback(this.data['fbPicturesNoPictures.json']);
                    expect(this.pictures.reset).toHaveBeenCalledWith(jasmine.any(Array));
                    // Get the array built from json data
                    var array = this.pictures.reset.calls.argsFor(0)[0];
                    expect(array.length).toEqual(0);
                });

                it('Without pictures, should call reset() with an empty array as parameter', function () {
                    this.apiCallback(this.data['fbPicturesNoData.json']);
                    expect(this.pictures.reset).toHaveBeenCalledWith(jasmine.any(Array));
                    // Get the array built from json data
                    var array = this.pictures.reset.calls.argsFor(0)[0];
                    expect(array.length).toEqual(0);
                });
            });

            describe('With a non standart JSON (empty or corrupted JSON)', function () {
                it('Should throw an error with an empty string as JSON', function () {
                    expect(this.apiCallback.bind(null, '')).toThrow();
                    expect(this.pictures.reset).not.toHaveBeenCalled();
                });

                it('Should throw an error with a corrupted JSON', function () {
                    expect(this.apiCallback.bind(null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae rutrum est. Pellentesque ut ligula nec justo porta pretium. Aliquam.')).toThrow();
                    expect(this.pictures.reset).not.toHaveBeenCalled();
                });
            });
        });
    });
});