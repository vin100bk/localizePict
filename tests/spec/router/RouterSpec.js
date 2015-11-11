/**
 * Tests suite for App
 */
describe('LocalizePict.Router.Router', function () {

    afterEach(function () {
        this.router.navigate('', {replace: true});
        Backbone.history.stop();
    });

    beforeEach(function () {
        // Create the routers
        this.router = new LocalizePict.Router.Router();
        Backbone.history.start({silent: true});

        // Needed. Avoid navigate to the same page
        this.router.navigate('elsewhere', {replace: true});
    });

    describe('index', function () {
        beforeEach(function() {
            spyOn(LocalizePict.View.Map.prototype, 'render');
            this.router.navigate('', {trigger: true, replace: true});
        });

        it('Should render the map', function() {
            expect(LocalizePict.View.Map.prototype.render).toHaveBeenCalled();
        });
    });

    describe('picture/:pictureId', function () {
        beforeEach(function() {
            this.router.app.model = new LocalizePict.Collection.Pictures([
                new LocalizePict.Model.Picture({
                    pid: 'myPictureId',
                    icon: 'http://myicon1.jpg',
                    picture: 'http://myoriginal1.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                })]);
        });

        it('Should render the application if it is not already done', function() {
            spyOn(this.router.app, 'render');
            this.router.navigate('picture/myPictureId', {trigger: true, replace: true});
            expect(this.router.app.render).toHaveBeenCalled();
        });

        it('Should render the picture', function() {
            spyOn(this.router.app, 'render');
            spyOn(LocalizePict.View.Picture.prototype, 'render');
            this.router.navigate('picture/myPictureId', {trigger: true, replace: true});
            expect(LocalizePict.View.Picture.prototype.render).toHaveBeenCalledWith('myPictureId', this.router.app.model);
        });

        it('Should show a 404 if the picture does not exist', function() {
            spyOn(LocalizePict.View.Error.prototype, 'render404');
            this.router.navigate('picture/1', {trigger: true, replace: true});
            expect(LocalizePict.View.Error.prototype.render404).toHaveBeenCalled();
        });
    });

    describe('Non existing page', function () {
        beforeEach(function() {
            spyOn(LocalizePict.View.Error.prototype, 'render404');
            this.router.navigate('anywhere', {trigger: true, replace: true});
        });

        it('Should render the error', function() {
            expect(LocalizePict.View.Error.prototype.render404).toHaveBeenCalled();
        });
    });
});
